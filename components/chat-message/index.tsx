'use client'

interface ChatMessageProps {
	sender: string
	message: string
	createdAt: string
	isOwnMessage: boolean
}

export default function ChatMessage({
	sender,
	message,
	createdAt,
	isOwnMessage,
}: ChatMessageProps) {
	const date = new Date(createdAt)
	const formattedDate = date.toLocaleString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
	})

	const isSystemMessage = sender === 'system'

	const containerClass = isSystemMessage
		? 'justify-center'
		: isOwnMessage
		? 'justify-end'
		: 'justify-start'

	const messageClass = isSystemMessage
		? 'bg-gray-200 text-gray-800'
		: isOwnMessage
		? 'bg-blue-500 text-white'
		: 'bg-gray-300 text-gray-800'

	return (
		<div className={`flex ${containerClass} mb-3`}>
			<div className={`max-w-xs px-4 py-2 rounded-lg ${messageClass}`}>
				{!isSystemMessage && <p className={`text-sm font-bold ${isOwnMessage ? 'text-right' : ''}`}>{sender}</p>}
				<p className='break-words'>{message}</p>
				<p className='opacity-50 text-xs'>{formattedDate}</p>
			</div>
		</div>
	)
}
