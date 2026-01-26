import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import Message from '../models/Message'
import Auction from '../models/Auction'

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { auctionId } = req.params
        const userId = req.userId

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' })
        }

        // Check if user is part of the auction (either creator or winner)
        const auction = await Auction.findById(auctionId)
        if (!auction) {
            return res.status(404).json({ success: false, message: 'Auction not found' })
        }

        const isCreator = auction.createdBy.toString() === userId
        const isWinner = auction.currentWinner?.toString() === userId

        if (!isCreator && !isWinner) {
            return res.status(403).json({ success: false, message: 'You are not authorized to view messages for this auction' })
        }

        const messages = await Message.find({ auctionId })
            .populate('senderId', 'username')
            .sort({ createdAt: 1 })
            .lean()

        res.json({ success: true, messages })
    } catch (error) {
        console.error('Error fetching messages:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch messages' })
    }
}
