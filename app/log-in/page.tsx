'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import useUsers from '@/hooks/useUsers'

export default function LogIn() {
	const router = useRouter()
	const { logIn } = useUsers()

	const [userName, setUserName] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)

		try {
			const response = await logIn(userName, password)

			if (response && response.error) {
				setError(response.error.message)
			} else {
				sessionStorage.setItem('user', JSON.stringify(response.data))
				router.push('/')
			}
		} catch (error) {
			console.error('Error during login:', error)
			setError('Something went wrong')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<div className='absolute inset-0 z-[1] bg-[rgba(0,0,0,0.5)] backdrop-blur-sm' />

			<div className='fixed bg-white rounded-[10px] p-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[2] w-full max-w-md mx-auto shadow-lg'>
				<h1 className='mb-6 text-2xl font-bold text-center'>Log In</h1>
				<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
					<input
						type='text'
						placeholder='Enter your name'
						className='p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
						value={userName}
						onChange={e => setUserName(e.target.value)}
						required
						autoComplete='username'
					/>
					<input
						type='password'
						placeholder='Enter password'
						className='p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
						autoComplete='current-password'
					/>
					{error && <p className='text-red-600 text-center'>{error}</p>}
					<button
						type='submit'
						className='p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors'
						disabled={loading}
					>
						{loading ? 'Logging in...' : 'Log In'}
					</button>
				</form>
			</div>
		</>
	)
}