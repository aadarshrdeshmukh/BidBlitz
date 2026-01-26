import { Server, Socket } from 'socket.io'
import Auction from '../models/Auction'
import Bid from '../models/Bid'
import User from '../models/User'
import Message from '../models/Message'
import { auctionStateManager } from '../services/auctionState'

const ANTI_SNIPE_THRESHOLD = 30000 // 30 seconds
const ANTI_SNIPE_EXTENSION = 60000 // 1 minute extension

export const setupAuctionHandlers = (io: Server, socket: Socket) => {

  // Join auction room
  socket.on('joinAuction', async (data: { auctionId: string; userId?: string }) => {
    const { auctionId, userId } = data

    try {
      const auction = await Auction.findById(auctionId)
      if (!auction) {
        socket.emit('error', { message: 'Auction not found' })
        return
      }

      // Join the room
      socket.join(`auction:${auctionId}`)
      auctionStateManager.addParticipant(auctionId, socket.id)

      // Initialize auction state if not exists
      auctionStateManager.initAuction(
        auctionId,
        auction.currentBid,
        auction.endTime,
        auction.currentWinner?.toString(),
        auction.minIncrement
      )

      // Get recent bids
      const recentBids = await Bid.find({ auctionId, status: 'accepted' })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean()

      const auctionState = auctionStateManager.getAuction(auctionId)
      const participantCount = auctionStateManager.getParticipantCount(auctionId)

      // Send current auction state
      socket.emit('auctionJoined', {
        auction: {
          _id: auction._id,
          title: auction.title,
          description: auction.description,
          imageUrl: auction.imageUrl,
          category: auction.category,
          auctionType: auction.auctionType,
          currentBid: auctionState?.currentBid || auction.currentBid,
          startingBid: auction.startingBid,
          endTime: auctionState?.endTime || auction.endTime,
          status: auction.status,
          currentWinner: auctionState?.currentWinner,
          createdBy: auction.createdBy
        },
        bids: recentBids,
        participantCount
      })

      // Notify others
      socket.to(`auction:${auctionId}`).emit('participantJoined', { participantCount })

      // Start timer if not already running
      startAuctionTimer(io, auctionId)

    } catch (error) {
      console.error('Error joining auction:', error)
      socket.emit('error', { message: 'Failed to join auction' })
    }
  })

  // Place bid
  socket.on('placeBid', async (data: { auctionId: string; userId: string; username: string; amount: number }) => {
    const { auctionId, userId, username, amount } = data

    try {
      const auction = await Auction.findById(auctionId)
      if (!auction) {
        socket.emit('bidRejected', { message: 'Auction not found' })
        return
      }

      if (auction.status !== 'active') {
        socket.emit('bidRejected', { message: 'Auction is not active' })
        return
      }

      const auctionState = auctionStateManager.getAuction(auctionId)
      if (!auctionState || auctionState.isEnded) {
        socket.emit('bidRejected', { message: 'Auction has ended' })
        return
      }

      // Validate bid amount
      const currentBid = auctionState.currentBid
      const minIncrement = auctionState.minIncrement || 1

      if (amount < currentBid + minIncrement) {
        socket.emit('bidRejected', {
          message: `Bid must be at least $${currentBid + minIncrement}`,
          currentBid
        })
        return
      }

      // Check User Balance (Wallet)
      const user = await User.findById(userId)
      if (!user || user.balance < amount) {
        socket.emit('bidRejected', {
          message: 'Insufficient wallet balance. Please top up your account.',
          currentBalance: user?.balance || 0
        })
        return
      }

      // Check if user is bidding against themselves
      if (auctionState.currentWinner === userId) {
        socket.emit('bidRejected', { message: 'You are already the highest bidder' })
        return
      }

      // Update in-memory state (single source of truth)
      const success = auctionStateManager.updateBid(auctionId, amount, userId)
      if (!success) {
        socket.emit('bidRejected', { message: 'A higher bid was just placed' })
        return
      }

      // Save bid to database
      const bid = new Bid({
        auctionId,
        userId,
        username,
        amount,
        status: 'accepted'
      })
      await bid.save()

      // Update auction in database
      auction.currentBid = amount
      auction.currentWinner = userId as any

      // Check for anti-sniping (disabled for rapid auctions)
      const timeRemaining = auctionState.endTime.getTime() - Date.now()
      let extended = false
      if (auction.auctionType !== 'rapid' && timeRemaining < ANTI_SNIPE_THRESHOLD && timeRemaining > 0) {
        auctionStateManager.extendTimer(auctionId, ANTI_SNIPE_EXTENSION / 1000)
        auction.endTime = auctionState.endTime
        extended = true
      }

      await auction.save()

      // Broadcast bid accepted to all participants
      io.to(`auction:${auctionId}`).emit('bidAccepted', {
        bid: {
          id: bid._id,
          userId,
          username,
          amount,
          createdAt: bid.createdAt
        },
        currentBid: amount,
        currentWinner: userId,
        extended,
        newEndTime: extended ? auctionState.endTime : undefined
      })

      // Restart timer if extended
      if (extended) {
        startAuctionTimer(io, auctionId)
      }

    } catch (error) {
      console.error('Error placing bid:', error)
      socket.emit('bidRejected', { message: 'Failed to place bid' })
    }
  })

  // Leave auction
  socket.on('leaveAuction', (data: { auctionId: string }) => {
    const { auctionId } = data
    socket.leave(`auction:${auctionId}`)
    auctionStateManager.removeParticipant(auctionId, socket.id)

    const participantCount = auctionStateManager.getParticipantCount(auctionId)
    socket.to(`auction:${auctionId}`).emit('participantLeft', { participantCount })
  })

  // Handle Messaging (Post-Auction or During)
  socket.on('sendMessage', async (data: { auctionId: string; senderId: string; username: string; content: string }) => {
    const { auctionId, senderId, username, content } = data

    try {
      const auction = await Auction.findById(auctionId)
      if (!auction) return

      // Find receiver (if sender is creator, receiver is winner, and vice-versa)
      let receiverId: any = null
      if (senderId === auction.createdBy.toString()) {
        receiverId = auction.currentWinner
      } else if (senderId === auction.currentWinner?.toString()) {
        receiverId = auction.createdBy
      }

      if (!receiverId) return

      const message = new Message({
        auctionId,
        senderId,
        receiverId,
        content
      })
      await message.save()

      // Broadcast to room
      io.to(`auction:${auctionId}`).emit('newMessage', {
        _id: message._id,
        auctionId,
        senderId: { _id: senderId, username: username || 'User' },
        content,
        createdAt: message.createdAt
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
  })

  // Handle disconnect
  socket.on('disconnecting', () => {
    // Remove from all auction rooms
    const rooms = Array.from(socket.rooms)
    rooms.forEach(room => {
      if (room.startsWith('auction:')) {
        const auctionId = room.replace('auction:', '')
        auctionStateManager.removeParticipant(auctionId, socket.id)
        const participantCount = auctionStateManager.getParticipantCount(auctionId)
        socket.to(room).emit('participantLeft', { participantCount })
      }
    })
  })
}

// Timer management
const startAuctionTimer = (io: Server, auctionId: string) => {
  const auctionState = auctionStateManager.getAuction(auctionId)
  if (!auctionState || auctionState.isEnded) return

  // Clear existing timer
  auctionStateManager.clearTimer(auctionId)

  const updateTimer = () => {
    const state = auctionStateManager.getAuction(auctionId)
    if (!state || state.isEnded) return

    const timeRemaining = state.endTime.getTime() - Date.now()

    if (timeRemaining <= 0) {
      endAuction(io, auctionId)
    } else {
      // Broadcast timer update
      io.to(`auction:${auctionId}`).emit('timerUpdate', {
        timeRemaining,
        endTime: state.endTime
      })

      // Schedule next update (every second)
      const timer = setTimeout(updateTimer, 1000)
      auctionStateManager.setTimer(auctionId, timer)
    }
  }

  updateTimer()
}

const endAuction = async (io: Server, auctionId: string) => {
  const auctionState = auctionStateManager.getAuction(auctionId)
  if (!auctionState || auctionState.isEnded) return

  auctionStateManager.endAuction(auctionId)

  try {
    // Update auction in database
    const auction = await Auction.findById(auctionId)
    if (auction) {
      auction.status = 'ended'
      const finalBid = auctionState.currentBid
      const winnerId = auctionState.currentWinner
      const sellerId = auction.createdBy

      // ESCROW PAYMENT LOGIC
      if (winnerId && finalBid > 0) {
        // Transfer funds
        const winner = await User.findById(winnerId)
        const seller = await User.findById(sellerId)

        if (winner && seller) {
          // Deduct from winner
          winner.balance -= finalBid
          await winner.save()

          // Add to seller
          seller.balance += finalBid
          await seller.save()

          console.log(`✓ Escrow Payment: $${finalBid} transferred from ${winner.username} to ${seller.username}`)
        }
      }

      await auction.save()

      // Broadcast auction ended
      io.to(`auction:${auctionId}`).emit('auctionEnded', {
        auctionId,
        finalBid,
        winner: winnerId,
        endTime: auctionState.endTime
      })

      console.log(`Auction ${auctionId} ended. Winner: ${winnerId}, Final bid: ${finalBid}`)
    }
  } catch (error) {
    console.error('Error ending auction:', error)
  }
}

// Initialize active auctions on server start
export const initializeActiveAuctions = async (io: Server) => {
  try {
    const activeAuctions = await Auction.find({ status: 'active' })

    for (const auction of activeAuctions) {
      const now = new Date()
      if (auction.endTime > now) {
        auctionStateManager.initAuction(
          auction._id.toString(),
          auction.currentBid,
          auction.endTime,
          auction.currentWinner?.toString(),
          auction.minIncrement
        )
        startAuctionTimer(io, auction._id.toString())
        console.log(`Initialized auction: ${auction.title}`)
      } else {
        // Auction should have ended
        auction.status = 'ended'
        await auction.save()
      }
    }
  } catch (error) {
    console.error('Error initializing auctions:', error)
  }
}
