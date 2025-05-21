import { Server as SocketIOServer } from 'socket.io'
import { NextRequest, NextResponse } from 'next/server'
import { instrument } from '@socket.io/admin-ui'

export const config = {
  api: {
    bodyParser: false,
  },
}

let io: SocketIOServer | undefined

export async function GET(req: NextRequest) {
  if (!io) {
    const { Server } = await import('socket.io')

    io = new Server({
      path: '/api/socket',
      cors: {
        origin: ['https://admin.socket.io'],
        credentials: true,
      },
    })

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      socket.on('join-room', ({ room }) => {
        socket.join(room)
        const usersInRoom = io!.sockets.adapter.rooms.get(room)
        const count = usersInRoom ? usersInRoom.size : 1
        io!.to(room).emit('room_users', { count })
      })

      socket.on('message', ({ room, sender, message }) => {
        socket.to(room).emit('message', { sender, message })
      })

      socket.on('disconnecting', () => {
        const rooms = [...socket.rooms].filter(r => r !== socket.id)
        rooms.forEach(room => {
          const usersInRoom = io!.sockets.adapter.rooms.get(room)
          const count = usersInRoom ? usersInRoom.size - 1 : 0
          io!.to(room).emit('room_users', { count })
        })
      })
    })

    instrument(io, {
      auth: false,
    })

    console.log('Socket.IO initialized')
  }

  return new NextResponse(null, { status: 200 })
}
