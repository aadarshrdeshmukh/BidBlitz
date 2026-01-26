import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import Auction from '../models/Auction'
import Bid from '../models/Bid'

export const getAllAuctions = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search, category, minPrice, maxPrice, sortBy, auctionType } = req.query
    const filter: any = {}

    // Status filter
    if (status) {
      filter.status = status
    }

    // Auction Type filter
    if (auctionType) {
      filter.auctionType = auctionType
    }

    // Search filter (title or description)
    if (search && typeof search === 'string') {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Category filter
    if (category && category !== 'All') {
      filter.category = category
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.currentBid = {}
      if (minPrice) filter.currentBid.$gte = Number(minPrice)
      if (maxPrice) filter.currentBid.$lte = Number(maxPrice)
    }

    // Determine sort order
    let sortOption: any = { createdAt: -1 } // Default: newest first
    if (sortBy === 'price-low') {
      sortOption = { currentBid: 1 }
    } else if (sortBy === 'price-high') {
      sortOption = { currentBid: -1 }
    } else if (sortBy === 'ending-soon') {
      sortOption = { endTime: 1 }
    }

    const auctions = await Auction.find(filter)
      .populate('createdBy', 'username email')
      .populate('currentWinner', 'username')
      .sort(sortOption)
      .lean()

    res.json({ success: true, auctions })
  } catch (error) {
    console.error('Error fetching auctions:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch auctions' })
  }
}

export const getAuctionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const auction = await Auction.findById(id)
      .populate('createdBy', 'username email')
      .populate('currentWinner', 'username')
      .lean()

    if (!auction) {
      return res.status(404).json({ success: false, message: 'Auction not found' })
    }

    // Get bid history
    const bids = await Bid.find({ auctionId: id, status: 'accepted' })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    res.json({ success: true, auction, bids })
  } catch (error) {
    console.error('Error fetching auction:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch auction' })
  }
}

export const createAuction = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      startingBid,
      minIncrement,
      durationMinutes,
      durationSeconds,
      imageUrl,
      category,
      auctionType = 'regular'
    } = req.body
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    if (!title || !startingBid) {
      return res.status(400).json({
        success: false,
        message: 'Title and starting bid are required'
      })
    }

    const now = new Date()
    let durationMs = 0
    if (auctionType === 'rapid') {
      durationMs = (durationSeconds || 15) * 1000
    } else {
      durationMs = (durationMinutes || 60) * 60000
    }

    const endTime = new Date(now.getTime() + durationMs)

    const auction = new Auction({
      title,
      description: description || '',
      imageUrl,
      category: category || 'Other',
      auctionType,
      startingBid,
      minIncrement: minIncrement || 1,
      currentBid: startingBid,
      startTime: now,
      endTime,
      status: 'active',
      createdBy: userId
    })

    await auction.save()

    res.status(201).json({
      success: true,
      message: 'Auction created successfully',
      auction
    })
  } catch (error) {
    console.error('Error creating auction:', error)
    res.status(500).json({ success: false, message: 'Failed to create auction' })
  }
}

export const getBidHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { limit = 50 } = req.query

    const bids = await Bid.find({ auctionId: id, status: 'accepted' })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean()

    res.json({ success: true, bids })
  } catch (error) {
    console.error('Error fetching bid history:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch bid history' })
  }
}

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    // Auctions where user is the current winner
    const wonAuctions = await Auction.find({
      currentWinner: userId,
      status: 'ended'
    }).lean()

    // Auctions where user is currently winning (active)
    const winningAuctions = await Auction.find({
      currentWinner: userId,
      status: 'active'
    }).lean()

    // Auctions where user has placed bids but not currently winning
    const userBids = await Bid.find({ userId }).distinct('auctionId')
    const participatingAuctions = await Auction.find({
      _id: { $in: userBids },
      currentWinner: { $ne: userId },
      status: 'active'
    }).lean()

    res.json({
      success: true,
      stats: {
        won: wonAuctions,
        winning: winningAuctions,
        participating: participatingAuctions
      }
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch user statistics' })
  }
}
