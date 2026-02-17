import express from 'express'
import { getMessages } from '../controllers/messageController'
import { authMiddleware, requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { getMessagesSchema } from '../schemas/messageSchema'

const router = express.Router()

router.get('/:auctionId', authMiddleware, requireAuth, validate(getMessagesSchema), getMessages)

export default router
