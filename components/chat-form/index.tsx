'use client'

import { useState } from 'react'

export default function ChatForm({
	author,
	onSendMessage,
}: {
	chatId: string
	author: string
	onSendMessage: (message: { author: string; text: string; createdAt: string }) => void
}) {
	const [message, setMessage] = useState('')

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (message.trim() !== '') {
			const createdAt = new Date().toISOString()
		
			onSendMessage({ author, text: message, createdAt })
			setMessage('')
		}
	}

	return (
		<form onSubmit={handleSubmit} className='flex gap-2 mt-4'>
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
