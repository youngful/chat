import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export const useUserSession = () => {
	const router = useRouter()
	const [userId, setUserId] = useState('')
	const [userName, setUserName] = useState('')
	const [userChatsIds, setUserChatsIds] = useState<string[]>([])

	useEffect(() => {
		const data = sessionStorage.getItem('user')
		if (!data) {
			router.push('/log-in')
			return
		}

		const storedUser = JSON.parse(data)
		
		setUserId(storedUser.userId)
		setUserName(storedUser.userName)
		if (storedUser.chatsId) setUserChatsIds(storedUser.chatsId)
	}, [router])

	return { userId, userName, userChatsIds }
}
