import { Router } from 'express'
import * as auctionController from '../controllers/auctionController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.get('/', auctionController.getAllAuctions)
router.get('/stats', authMiddleware, auctionController.getUserStats)
router.get('/:id', auctionController.getAuctionById)
router.get('/:id/bids', auctionController.getBidHistory)
router.post('/', authMiddleware, auctionController.createAuction)

export default router
