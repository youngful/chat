'use client'

import React from 'react'

interface Chat {
	id: string
	chatName: string
}

interface SidebarProps {
	chats: Chat[]
	activeChatId: string
	onSelectChat: (chatId: string, chatName: string) => void
}

export default function Sidebar({
	chats,
	activeChatId,
	onSelectChat,
}: SidebarProps) {
	return (
		<aside className=' w-[200px] bg-gray-100 border-r border-gray-300 h-screen flex flex-col'>
			<h2 className='p-4 text-xl font-bold border-b border-gray-300'>
				Your Chats
			</h2>
			<ul className='flex-1 overflow-auto'>
				{chats.length === 0 && (
					<li className='p-4 text-gray-500'>No chats available</li>
				)}
				{chats.map(chat => (
					<li
						key={chat.id}
						className={`cursor-pointer px-4 py-3 hover:bg-blue-100 ${
							activeChatId === chat.id ? 'bg-blue-200 font-semibold' : ''
						}`}
						onClick={() => onSelectChat(chat.id, chat.chatName)}
					>
						{chat.chatName}
					</li>
				))}
			</ul>
		</aside>
	)
}
