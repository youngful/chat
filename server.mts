import { createServer } from 'node:http'
import next from 'next'
import { Server } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'

const dev = process.env.NODE_ENV !== 'production'
const hostName = process.env.HOST_NAME || 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname: hostName, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
	const httpServer = createServer(handle)
	const io = new Server(httpServer, {
		cors: {
			origin: ['https://admin.socket.io'],
			credentials: true,
		},
	})

	io.on('connection', socket => {
		// socket.on('join-room', ({ room, userName }) => {
		socket.on('join-room', ({ room }) => {
			socket.join(room)

			const usersInRoom = io.sockets.adapter.rooms.get(room)
			const count = usersInRoom ? usersInRoom.size : 1

			// io.to(room).emit('user_joined', `${userName} joined the chat`)
			io.to(room).emit('room_users', { count })
		})

		socket.on('message', ({ room, sender, message }) => {
			socket.to(room).emit('message', { sender, message })
		})

		socket.on('disconnecting', () => {
			const rooms = [...socket.rooms].filter(r => r !== socket.id)
			rooms.forEach(room => {
				const usersInRoom = io.sockets.adapter.rooms.get(room)
				const count = usersInRoom ? usersInRoom.size - 1 : 0

				io.to(room).emit('room_users', { count })
			})
		})
	})

	instrument(io, {
		auth: false,
	})

	httpServer.listen(port, () => {
		console.log(`server is running on http://${hostName}:${port}`)
	})
})
