import express from 'express'
import { getMessages } from '../controllers/messageController'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

router.get('/:auctionId', authMiddleware, getMessages)

export default router
