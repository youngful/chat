'use client'
import { useState } from 'react'

export default function LogIn({
	handleUserLogin,
}: {
	handleUserLogin: (userName: string) => void
}) {
	const [userName, setUserName] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)

		try {
			const res = await fetch('/api/user-login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userName, password }),
			})

			if (!res.ok) {
				const data = await res.json()
				setError(data.error || 'Login failed')
				setLoading(false)
				return
			}

			const data = await res.json()
			handleUserLogin(data.userName)
		} catch (err) {
			console.error('Error during login:', err)
			setError('Something went wrong')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<div className='fixed inset-0 z-[1] bg-[rgba(0,0,0,0.5)] backdrop-blur-xs' />

			<div className='fixed bg-white rounded-[10px] p-[24px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[2] w-full max-w-md mx-auto'>
				<h1 className='mb-4 text-2xl font-bold text-center'>Log In</h1>
				<form onSubmit={handleSubmit} className='flex flex-col gap-3'>
					<input
						type='text'
						placeholder='Enter your name'
						className='p-2 border border-gray-300 rounded'
						value={userName}
						onChange={e => setUserName(e.target.value)}
						required
					/>
					<input
						type='password'
						placeholder='Enter password'
						className='p-2 border border-gray-300 rounded'
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
					{error && <p className='text-red-600'>{error}</p>}
					<button
						type='submit'
						className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
						disabled={loading}
					>
						{loading ? 'Logging in...' : 'Log In'}
					</button>
				</form>
			</div>
		</>
	)
}
