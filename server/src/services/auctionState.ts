import { Types } from 'mongoose'

interface AuctionState {
  auctionId: string
  currentBid: number
  minIncrement: number
  currentWinner?: string
  endTime: Date
  timer?: NodeJS.Timeout
  isEnded: boolean
  participants: Set<string>
}

class AuctionStateManager {
  private auctions: Map<string, AuctionState> = new Map()

  initAuction(auctionId: string, currentBid: number, endTime: Date, currentWinner?: string, minIncrement: number = 1) {
    if (!this.auctions.has(auctionId)) {
      this.auctions.set(auctionId, {
        auctionId,
        currentBid,
        minIncrement,
        currentWinner,
        endTime,
        isEnded: false,
        participants: new Set()
      })
    }
  }

  getAuction(auctionId: string): AuctionState | undefined {
    return this.auctions.get(auctionId)
  }

  updateBid(auctionId: string, amount: number, userId: string): boolean {
    const auction = this.auctions.get(auctionId)
    if (!auction || auction.isEnded) return false

    if (amount > auction.currentBid) {
      auction.currentBid = amount
      auction.currentWinner = userId
      return true
    }
    return false
  }

  extendTimer(auctionId: string, seconds: number) {
    const auction = this.auctions.get(auctionId)
    if (auction && !auction.isEnded) {
      auction.endTime = new Date(auction.endTime.getTime() + seconds * 1000)
    }
  }

  addParticipant(auctionId: string, socketId: string) {
    const auction = this.auctions.get(auctionId)
    if (auction) {
      auction.participants.add(socketId)
    }
  }

  removeParticipant(auctionId: string, socketId: string) {
    const auction = this.auctions.get(auctionId)
    if (auction) {
      auction.participants.delete(socketId)
    }
  }

  getParticipantCount(auctionId: string): number {
    const auction = this.auctions.get(auctionId)
    return auction ? auction.participants.size : 0
  }

  endAuction(auctionId: string) {
    const auction = this.auctions.get(auctionId)
    if (auction) {
      auction.isEnded = true
      if (auction.timer) {
        clearTimeout(auction.timer)
      }
    }
  }

  setTimer(auctionId: string, timer: NodeJS.Timeout) {
    const auction = this.auctions.get(auctionId)
    if (auction) {
      if (auction.timer) {
        clearTimeout(auction.timer)
      }
      auction.timer = timer
    }
  }

  clearTimer(auctionId: string) {
    const auction = this.auctions.get(auctionId)
    if (auction && auction.timer) {
      clearTimeout(auction.timer)
      auction.timer = undefined
    }
  }

  removeAuction(auctionId: string) {
    const auction = this.auctions.get(auctionId)
    if (auction && auction.timer) {
      clearTimeout(auction.timer)
    }
    this.auctions.delete(auctionId)
  }

  getAllActiveAuctions(): string[] {
    return Array.from(this.auctions.keys()).filter(id => {
      const auction = this.auctions.get(id)
      return auction && !auction.isEnded
    })
  }
}

export const auctionStateManager = new AuctionStateManager()
