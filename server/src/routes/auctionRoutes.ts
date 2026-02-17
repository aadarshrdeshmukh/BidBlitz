import { Router } from 'express'
import * as auctionController from '../controllers/auctionController'
import { authMiddleware, requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createAuctionSchema, auctionIdSchema } from '../schemas/auctionSchema'

const router = Router()

// Public routes
router.get('/', auctionController.getAllAuctions)
router.get('/:id', validate(auctionIdSchema), auctionController.getAuctionById)
router.get('/:id/bids', validate(auctionIdSchema), auctionController.getBidHistory)

// Protected routes
router.use(authMiddleware)
router.get('/stats', requireAuth, auctionController.getUserStats)
router.post('/', requireAuth, validate(createAuctionSchema), auctionController.createAuction)

export default router
