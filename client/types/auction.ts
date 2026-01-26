export interface User {
  id: string
  email: string
  username: string
}

export interface Auction {
  _id: string
  title: string
  description: string
  imageUrl?: string
  category: string
  startingBid: number
  currentBid: number
  currentWinner?: User | string
  startTime: string
  endTime: string
  status: 'pending' | 'active' | 'ended'
  auctionType: 'regular' | 'rapid'
  createdBy: User | string
  createdAt: string
}

export interface Bid {
  _id: string
  auctionId: string
  userId: string
  username: string
  amount: number
  status: 'accepted' | 'rejected' | 'pending'
  createdAt: string
}

export interface AuctionState {
  auction: Auction
  bids: Bid[]
  participantCount: number
  timeRemaining: number
  isEnded: boolean
}

export interface BidAcceptedEvent {
  bid: {
    id: string
    userId: string
    username: string
    amount: number
    createdAt: string
  }
  currentBid: number
  currentWinner: string
  extended: boolean
  newEndTime?: string
}

export interface TimerUpdateEvent {
  timeRemaining: number
  endTime: string
}

export interface AuctionEndedEvent {
  auctionId: string
  finalBid: number
  winner: string
  endTime: string
}

export interface BidRejectedEvent {
  message: string
  currentBid?: number
}
