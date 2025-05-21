import { supabase } from '@/lib/supabaseClient'
import {MessageRow} from '@/global'

function useMessages() {
	const getMessages = async (chatId: string) => {
	if (!chatId) return

	const { data, error } = await supabase
		.from('messages')
		.select('content, created_at, author, users(userName)')
		.eq('chat_id', chatId)
		.order('created_at', { ascending: true })

	if (error || !data) {
		console.error('Error fetching messages:', error)
		return
	}

	const normalizedData: MessageRow[] = data.map((msg) => ({
		content: msg.content,
		created_at: msg.created_at,
		author: msg.author,
		users: msg.users || { userName: 'Unknown' }, // <-- нормалізація
	}))

	console.log('Fetched messages:', normalizedData);
	
	const loadedMessages = normalizedData.map((msg) => ({
		sender: msg.users.userName,
		message: msg.content,
		createdAt: msg.created_at,
	}))

	return loadedMessages
}

	const saveMessage = async (
		content: string | File,
		author: string,
		chatId: string,
		type: 'text' | 'file' = 'text'
	): Promise<{ success: boolean; path?: string } | false> => {
		try {
			let filePath = ''
			let messageContent = ''

			if (type === 'file') {
				console.log('Uploading file:', content)

				if (!(content instanceof File)) {
					console.error('Content must be a File for type file')
					return false
				}

				const folder = 'chat-files'
				const timestamp = Date.now()
				const path = `${author}/${timestamp}_${content.name}`

				const { data, error: uploadError } = await supabase.storage
					.from(folder)
					.upload(path, content, {
						contentType: content.type,
						upsert: false,
					})

				if (uploadError || !data) {
					console.error('Upload error:', uploadError)
					return false
				}

				filePath = data.path
				messageContent = filePath
			}

			if (type === 'text') {
				if (typeof content !== 'string') {
					console.error('Content must be a string for type text')
					return false
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
				return false
			}

			console.log('Message saved:', messageData)

			return {
				success: true,
				path: type === 'file' ? filePath : undefined,
			}
		} catch (error) {
			console.error('Unexpected error:', error)
			return false
		}
	}

	return { saveMessage, getMessages }
}

export default useMessages
