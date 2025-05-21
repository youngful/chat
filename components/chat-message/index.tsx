'use client'

import { FileText, FileImage, FileVideo, FileArchive, File } from 'lucide-react'
import Image from 'next/image'
import { JSX } from 'react'

interface ChatMessageProps {
	sender: string
	message: string 
	createdAt: string
	isOwnMessage: boolean
}

const fileIconMap: { [key: string]: JSX.Element } = {
	pdf: <FileText size={40} className='mb-1 text-gray-600' />,
	doc: <FileText size={40} className='mb-1 text-gray-600' />,
	docx: <FileText size={40} className='mb-1 text-gray-600' />,
	txt: <FileText size={40} className='mb-1 text-gray-600' />,
	jpg: <FileImage size={40} className='mb-1 text-gray-600' />,
	png: <FileImage size={40} className='mb-1 text-gray-600' />,
	jpeg: <FileImage size={40} className='mb-1 text-gray-600' />,
	svg: <FileImage size={40} className='mb-1 text-gray-600' />,
	gif: <FileImage size={40} className='mb-1 text-gray-600' />,
	mp4: <FileVideo size={40} className='mb-1 text-gray-600' />,
	zip: <FileArchive size={40} className='mb-1 text-gray-600' />,
	default: <File size={40} className='mb-1 text-gray-600' />,
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

	// Основні кольори повідомлень
	const messageBgClass = isSystemMessage
		? 'bg-gray-200 text-gray-800'
		: isOwnMessage
		? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
		: 'bg-gray-100 text-gray-900 shadow-md'

	const messagePadding = 'px-4 py-3'

	// Визначення файлу
	const rawFileName = message.split('/').pop() || ''
	const fileName = rawFileName.replace(/^\d+_/, '')
	const fileExt = fileName.split('.').pop()?.toLowerCase() || ''

	const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg']
	const isImage = imageExtensions.includes(fileExt)

	const isFile =
		typeof message === 'string' &&
		message.includes('/') &&
		!!fileExt &&
		fileExt in fileIconMap

	const fileUrl = isFile
		? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/chat-files/${message}`
		: ''

	const icon = fileIconMap[fileExt] || fileIconMap.default

	return (
		<div className={`flex ${containerClass} mb-3`}>
			<div
				className={`${messageBgClass} max-w-xs rounded-lg break-words
					${!isFile || !isImage ? messagePadding : 'p-0 border rounded-lg overflow-hidden'}
				`}
			>
				{!isSystemMessage && !isFile && (
					<p
						className={`text-sm font-semibold mb-1 ${
							isOwnMessage ? 'text-right' : 'text-left'
						}`}
					>
						{sender}
					</p>
				)}

				{isFile ? (
					<a
						href={fileUrl}
						target='_blank'
						rel='noopener noreferrer'
						download
						className='block hover:bg-white/20 transition-colors'
					>
						{isImage ? (
							fileExt === 'svg' ? (
								<img
									src={fileUrl}
									alt={fileName}
									width={250}
									height={250}
									className='object-contain w-full max-h-60'
								/>
							) : (
								<Image
									src={fileUrl}
									alt={fileName}
									width={250}
									height={250}
									className='object-contain w-full max-h-60'
								/>
							)
						) : (
							<div className='p-3 flex flex-col items-center justify-center'>
								{icon}
								<p className='text-sm underline truncate max-w-xs mt-1'>{fileName}</p>
							</div>
						)}
					</a>
				) : (
						<p className='whitespace-pre-wrap'>{message}</p>
				)}

				<p className={`opacity-50 text-xs mt-1 text-right ${isImage && 'px-[16px] pb-[12px]'}`}>{formattedDate}</p>
			</div>
		</div>
	)
}
