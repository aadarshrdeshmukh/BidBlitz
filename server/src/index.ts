import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import { connectDB } from './config/database'
import { initializeSocket, initializeActiveAuctions } from './socket'
import auctionRoutes from './routes/auctionRoutes'
import userRoutes from './routes/userRoutes'
import messageRoutes from './routes/messageRoutes'
import { standardRateLimiter } from './middleware/rateLimiter'

dotenv.config()

// Pre-flight check for required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET']
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingEnvVars.length > 0) {
  console.error(`❌ CRITICAL ERROR: Missing environment variables: ${missingEnvVars.join(', ')}`)
  console.error('Please ensure these are set in your .env file or deployment dashboard.')
  process.exit(1)
}

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 5001

// Security Middleware
app.use(helmet()) // OWASP best practice: set security-related HTTP headers
app.use(mongoSanitize()) // Prevent NoSQL injection attacks by sanitizing operator characters ($ and .)
app.use(standardRateLimiter) // Apply rate limiting to all requests

// Middleware
app.use(cors({
  origin: (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, ''),
  credentials: true
}))
app.use(express.json({ limit: '5mb' })) // Increased from 10kb to accommodate image data URIs while remaining secure
app.use(express.urlencoded({ limit: '5mb', extended: true }))

// Initialize Socket.IO
const io = initializeSocket(httpServer)

// Make io accessible in routes
app.set('io', io)

// Routes
app.use('/api/auctions', auctionRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'BidBlitz API Server with Socket.IO' })
})

// Connect to database and start server
connectDB().then(async () => {
  // Initialize state from database
  await initializeActiveAuctions(io)

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Socket.IO initialized and auctions synchronized`)
  })
})
