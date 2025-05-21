import { useEffect, useState } from 'react'
import { socket } from '@/lib/socketClient'
import useMessages from './useMessages'

type Message = {
	sender: string
	message: string 
	createdAt: string
}

export function useChatSocket(roomId: string, userName: string) {
	const [messages, setMessages] = useState<Message[]>([])
	const [onlineUsers, setOnlineUsers] = useState(1)

	const { getMessages, saveMessage } = useMessages()

	const fetchMessages = async (chatId: string) => {
		const loadedMessages = await getMessages(chatId)

		if (!loadedMessages) return
		setMessages(loadedMessages)
	}

	useEffect(() => {
		if (!roomId) return

		setMessages([])
		fetchMessages(roomId)

		socket.emit('join-room', { room: roomId, userName })

		socket.on('message', data => setMessages(prev => [...prev, data]))
		socket.on('user_joined', message =>
			setMessages(prev => [
				...prev,
				{ sender: 'system', message, createdAt: new Date().toISOString() },
			])
		)
		socket.on('room_users', ({ count }) => setOnlineUsers(count))

		return () => {
			socket.off('message')
			socket.off('user_joined')
			socket.off('room_users')
		}
	}, [roomId, userName])

	const sendMessage = async (
  message: string | File,
  senderId: string,
  createdAt: string,
  file?: File
) => {
  if (!roomId) return

  const result = await saveMessage(
    message,
    senderId,
    roomId,
    file ? 'file' : 'text'
  )
  if (!result || !result.success) return

  const displayedMessage = file ? result.path : message

  setMessages(prev => [
    ...prev,
    {
      sender: userName,
      message: typeof displayedMessage === 'string' ? displayedMessage : (displayedMessage?.name ?? 'unknown file'),
      createdAt,
    }
  ])

  socket.emit('message', {
    room: roomId,
    message: displayedMessage,
    sender: userName,
    senderId,
    createdAt,
    file,
  })
}


	return { messages, sendMessage, onlineUsers }
}
