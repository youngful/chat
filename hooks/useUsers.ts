import { supabase } from '@/lib/supabaseClient'

function useUsers() {
	const logIn = async (userName: string, password: string) => {
		try {
			const { data: user, error } = await supabase
				.from('users')
				.select('*')
				.eq('userName', userName)
				.single()

			if (error || !user) {
				return { error }
			}

			if (password !== user.password) {
				return { error: { message: 'Invalid credentials' } }
			}

			return {
				data: {
					userName: user.userName,
					userId: user.id,
					chatsId: user.chats_id,
					role: user.role,
				},
			}
		} catch (error) {
			console.error('Error logging in:', error)
			return { error: { message: 'Something went wrong' } }
		}
	}

	return {
		logIn,
	}
}

export default useUsers
