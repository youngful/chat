'use client'

import ChatForm from '@/components/chat-form'
import ChatMessage from '@/components/chat-message'
import Sidebar from '@/components/side-bar'
import { useState } from 'react'
import { useChatSocket } from '@/hooks/useChatSocket'
import { useUserSession } from '@/hooks/useUserSession'
import { useUserChats } from '@/hooks/useUserChats'

export default function Home() {
	const { userId, userName, userChatsIds } = useUserSession()
	const availableChats = useUserChats(userChatsIds)	

	const [activeChat, setActiveChat] = useState<{
		id: string
		chatName: string
	} | null>(null)

	const { messages, sendMessage, onlineUsers } = useChatSocket(
		activeChat?.id || '',
		userName
	)

	const handleSelectChat = (chatId: string, chatName: string) => {
		if (chatId === activeChat?.id) return
		setActiveChat({ id: chatId, chatName })
	}

	return (
		<div className='flex w-full'>
			<div className='w-[200px]'>
				<Sidebar
					chats={availableChats}
					activeChatId={activeChat?.id || ''}
					onSelectChat={handleSelectChat}
				/>
			</div>

			<div className='flex flex-col w-full'>
				<h1 className='flex flex-col text-2xl font-bold p-[24px_40px]'>
					{activeChat?.chatName || 'No chat selected'}
					<span className='text-xs text-gray-500'>
						{activeChat ? ` (${onlineUsers} online)` : ''}
					</span>
				</h1>

				{activeChat ? (
					<div className='flex flex-col h-full overflow-y-auto border-y-2 border-gray-200 p-4'>
						{messages.map((msg, index) => (
							<ChatMessage
								key={index}
								sender={msg.sender}
								message={msg.message}
								createdAt={msg.createdAt}
								isOwnMessage={msg.sender === userName}
							/>
						))}
					</div>
				) : (
					<p className='text-center text-gray-500'>
						Please select a chat room from the sidebar
					</p>
				)}

				<div className='p-[24px_40px]'>
					{activeChat && (
						<ChatForm
							chatId={activeChat.id}
							author={userId}
							onSendMessage={({ author, text, createdAt }) => {
								sendMessage(text, author, createdAt)
							}}
						/>
					)}
				</div>
			</div>
		</div>
	)
}
