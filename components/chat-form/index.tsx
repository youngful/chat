'use client'

import { useRef, useState } from 'react'
import { Paperclip } from 'lucide-react'

export default function ChatForm({
	author,
	onSendMessage,
}: {
	author: string
	onSendMessage: (message: {
		author: string
		text: string
		createdAt: string
		file?: File
	}) => void
}) {
	const [message, setMessage] = useState('')
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const createdAt = new Date().toISOString()
		if (message.trim()) {
			onSendMessage({ author, text: message, createdAt })
			setMessage('')
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const createdAt = new Date().toISOString()
		onSendMessage({ author, text: '', createdAt, file })

		// Очищаємо file input
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	return (
		<form onSubmit={handleSubmit} className='flex gap-2 mt-4 items-center'>
			<button
				type='button'
				onClick={() => fileInputRef.current?.click()}
				className='p-2 text-gray-500 hover:text-blue-500'
			>
				<Paperclip />
			</button>

			<input
				type='file'
				ref={fileInputRef}
				onChange={handleFileChange}
				className='hidden'
			/>

			<input
				type='text'
				value={message}
				onChange={event => setMessage(event.target.value)}
				className='flex-1 px-4 border-2 border-[#ccc] py-2 rounded-lg focus:outline-none'
				placeholder='Type a message'
			/>

			<button
				type='submit'
				className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
			>
				Send
			</button>
		</form>
	)
}
