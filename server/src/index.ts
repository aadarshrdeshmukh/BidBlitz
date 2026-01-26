import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database'
import { initializeSocket } from './socket'
import auctionRoutes from './routes/auctionRoutes'
import userRoutes from './routes/userRoutes'
import messageRoutes from './routes/messageRoutes'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Initialize Socket.IO
const io = initializeSocket(httpServer)

// Make io accessible in routes
app.set('io', io)

// Routes
app.use('/api/auctions', auctionRoutes)
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'BidBlitz API Server with Socket.IO' })
})

// Connect to database and start server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Socket.IO initialized`)
  })
})
