import { useEffect, useState } from 'react'

export const useUserChats = (userChatsIds: string[]) => {
	const [availableChats, setAvailableChats] = useState<
		{ id: string; chatName: string }[]
	>([])

	useEffect(() => {
		if (userChatsIds.length === 0) return

		async function fetchChats() {
			try {
				
				const res = await fetch('/api/get-chats', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ chats_id: userChatsIds }),
				})
				const data = await res.json()
				if (!res.ok) throw new Error('Failed to fetch chats')

				setAvailableChats(data.chats)
			} catch (error) {
				console.error(error)
			}
		}

		fetchChats()
	}, [userChatsIds])

	return availableChats
}
