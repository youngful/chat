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
      setMessages(prev => [...prev, { sender: 'system', message, createdAt: new Date().toISOString() }])
    )
    socket.on('room_users', ({ count }) => setOnlineUsers(count))

    return () => {
      socket.off('message')
      socket.off('user_joined')
      socket.off('room_users')
    }
  }, [roomId, userName])

  const sendMessage = async (message: string, senderId: string, createdAt: string) => {
    if (!roomId) return

    const saved = await saveMessage(message, senderId, roomId, 'text')
    if (!saved) return

    setMessages(prev => [...prev, { sender: userName, message, createdAt }])

    socket.emit('message', { room: roomId, message, sender: userName, senderId, createdAt })
  }

  return { messages, sendMessage, onlineUsers }
}
