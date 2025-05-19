import { supabase } from '@/lib/supabaseClient'

function useMessages() {
	const getMessages = async (chatId: string) => {
		if (!chatId) return

		const { data, error } = await supabase
			.from('messages')
			.select('content, created_at, author, users(userName)')
			.eq('chat_id', chatId)
			.order('created_at', { ascending: true })

		if (error) {
			console.error('Error fetching messages:', error)
			return
		}

		const loadedMessages = data.map(msg => ({
			sender: msg.users?.userName || 'Unknown',
			message: msg.content,
			createdAt: msg.created_at,
		}))

		return loadedMessages
	}

	const saveMessage = async (
		content: string | File,
		author: string,
		chatId: string,
		type: 'text' | 'file' | 'link' | 'photo' = 'text'
	) => {
		try {
			let filePath = ''
			let messageContent = ''

			if (type === 'file' || type === 'photo') {
				if (!(content instanceof File)) {
					console.error('Content must be a File for type file/photo')
					return
				}

				const folder = type === 'photo' ? 'photo' : 'files'
				const timestamp = Date.now()
				const path = `${author}/${timestamp}_${content.name}`

				const { data, error: uploadError } = await supabase.storage
					.from(folder)
					.upload(path, content, {
						contentType: content.type,
						upsert: false,
					})

				if (uploadError) {
					console.error('Upload error:', uploadError)
					return
				}

				filePath = data.path
				messageContent = filePath
			}

			if (type === 'text' || type === 'link') {
				if (typeof content !== 'string') {
					console.error('Content must be a string for type text/link')
					return
				}
				messageContent = content
			}

			const { data: messageData, error: messageError } = await supabase
				.from('messages')
				.insert([
					{
						content: messageContent,
						author,
						type,
						chat_id: chatId,
					},
				])

			if (messageError) {
				console.error('Error saving message:', messageError)
				return
			}

			console.log('Message saved:', messageData)
			return true
		} catch (error) {
			console.error('Unexpected error:', error)
			return false
		}
	}

	return { saveMessage, getMessages }
}

export default useMessages
