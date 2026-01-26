import { Server as HTTPServer } from 'http'
import { Server, Socket } from 'socket.io'
import { setupAuctionHandlers, initializeActiveAuctions } from './auctionHandlers'

export const initializeSocket = (httpServer: HTTPServer): Server => {
  const origin = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '')

  const io = new Server(httpServer, {
    cors: {
      origin: [origin, `${origin}/`],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`)

    // Setup auction event handlers
    setupAuctionHandlers(io, socket)

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })

  return io
}

export { initializeActiveAuctions }
