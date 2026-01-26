import { useEffect, useState, useCallback } from 'react'
import { Socket } from 'socket.io-client'
import {
  Auction,
  Bid,
  BidAcceptedEvent,
  TimerUpdateEvent,
  AuctionEndedEvent,
  BidRejectedEvent
} from '@/types/auction'

interface UseAuctionProps {
  auctionId: string
  socket: Socket | null
  userId?: string
}

export const useAuction = ({ auctionId, socket, userId }: UseAuctionProps) => {
  const [auction, setAuction] = useState<Auction | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [participantCount, setParticipantCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isEnded, setIsEnded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showExtended, setShowExtended] = useState(false)

  // Join auction room
  useEffect(() => {
    if (!socket || !auctionId) return

    socket.emit('joinAuction', { auctionId, userId })

    const onAuctionJoined = (data: any) => {
      console.log('Auction joined:', data)
      setAuction(data.auction)
      setBids(data.bids || [])
      setParticipantCount(data.participantCount || 0)
      setIsEnded(data.auction.status === 'ended')
      setIsLoading(false)
    }

    const onBidAccepted = (data: BidAcceptedEvent) => {
      console.log('Bid accepted:', data)

      if (data.extended) {
        setShowExtended(true)
        setTimeout(() => setShowExtended(false), 3000)
      }

      // Update auction current bid
      setAuction(prev => prev ? {
        ...prev,
        currentBid: data.currentBid,
        currentWinner: data.currentWinner,
        endTime: data.extended && data.newEndTime ? data.newEndTime : prev.endTime
      } : null)

      // Add bid to history
      setBids(prev => [{
        _id: data.bid.id,
        auctionId,
        userId: data.bid.userId,
        username: data.bid.username,
        amount: data.bid.amount,
        status: 'accepted',
        createdAt: data.bid.createdAt
      }, ...prev])
    }

    const onBidRejected = (data: BidRejectedEvent) => {
      console.log('Bid rejected:', data)
      setError(data.message)

      // Rollback optimistic updates if needed
      // Actually, since the next 'bidAccepted' or 'auctionJoined' will fix it,
      // we just need to remove the pending bid from the history.
      setBids(prev => prev.filter(b => b.status !== 'pending'))

      setTimeout(() => setError(null), 5000)
    }

    const onTimerUpdate = (data: TimerUpdateEvent) => {
      setTimeRemaining(data.timeRemaining)
    }

    const onAuctionEnded = (data: AuctionEndedEvent) => {
      console.log('Auction ended:', data)
      setIsEnded(true)
      setAuction(prev => prev ? { ...prev, status: 'ended' } : null)
      setTimeRemaining(0)
    }

    const onParticipantJoined = (data: { participantCount: number }) => {
      setParticipantCount(data.participantCount)
    }

    const onParticipantLeft = (data: { participantCount: number }) => {
      setParticipantCount(data.participantCount)
    }

    const onSocketError = (data: { message: string }) => {
      console.error('Socket error:', data)
      setError(data.message)
      setBids(prev => prev.filter(b => b.status !== 'pending'))
    }

    socket.on('auctionJoined', onAuctionJoined)
    socket.on('bidAccepted', onBidAccepted)
    socket.on('bidRejected', onBidRejected)
    socket.on('timerUpdate', onTimerUpdate)
    socket.on('auctionEnded', onAuctionEnded)
    socket.on('participantJoined', onParticipantJoined)
    socket.on('participantLeft', onParticipantLeft)
    socket.on('error', onSocketError)

    return () => {
      socket.emit('leaveAuction', { auctionId })
      socket.off('auctionJoined', onAuctionJoined)
      socket.off('bidAccepted', onBidAccepted)
      socket.off('bidRejected', onBidRejected)
      socket.off('timerUpdate', onTimerUpdate)
      socket.off('auctionEnded', onAuctionEnded)
      socket.off('participantJoined', onParticipantJoined)
      socket.off('participantLeft', onParticipantLeft)
      socket.off('error', onSocketError)
    }
  }, [socket, auctionId, userId])

  const placeBid = useCallback((amount: number, username: string) => {
    if (!socket || !userId) {
      setError('You must be logged in to place a bid')
      return
    }

    if (isEnded) {
      setError('Auction has ended')
      return
    }

    // Optimistic Update
    setAuction(prev => prev ? { ...prev, currentBid: amount, currentWinner: userId } : null)
    setBids(prev => [{
      _id: 'pending-' + Date.now(),
      auctionId,
      userId,
      username,
      amount,
      status: 'pending' as any,
      createdAt: new Date().toISOString()
    }, ...prev])

    socket.emit('placeBid', {
      auctionId,
      userId,
      username,
      amount
    })
  }, [socket, auctionId, userId, isEnded])

  return {
    auction,
    bids,
    participantCount,
    timeRemaining,
    isEnded,
    error,
    isLoading,
    showExtended,
    placeBid
  }
}
