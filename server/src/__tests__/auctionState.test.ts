import { auctionStateManager } from '../services/auctionState'

describe('AuctionStateManager Tests', () => {
  const auctionId = 'test-auction-123'
  const userId1 = 'user-1'
  const userId2 = 'user-2'

  beforeEach(() => {
    // Clean up state
    auctionStateManager.removeAuction(auctionId)
  })

  describe('Auction Initialization', () => {
    it('should initialize auction state', () => {
      const endTime = new Date(Date.now() + 60000)
      auctionStateManager.initAuction(auctionId, 100, endTime)

      const auction = auctionStateManager.getAuction(auctionId)
      expect(auction).toBeDefined()
      expect(auction?.currentBid).toBe(100)
      expect(auction?.endTime).toEqual(endTime)
      expect(auction?.isEnded).toBe(false)
    })

    it('should not reinitialize existing auction', () => {
      const endTime = new Date(Date.now() + 60000)
      auctionStateManager.initAuction(auctionId, 100, endTime)
      auctionStateManager.initAuction(auctionId, 200, endTime)

      const auction = auctionStateManager.getAuction(auctionId)
      expect(auction?.currentBid).toBe(100) // Should remain unchanged
    })
  })

  describe('Bid Updates', () => {
    beforeEach(() => {
      const endTime = new Date(Date.now() + 60000)
      auctionStateManager.initAuction(auctionId, 100, endTime)
    })

    it('should update bid when amount is higher', () => {
      const success = auctionStateManager.updateBid(auctionId, 150, userId1)
      expect(success).toBe(true)

      const auction = auctionStateManager.getAuction(auctionId)
      expect(auction?.currentBid).toBe(150)
      expect(auction?.currentWinner).toBe(userId1)
    })

    it('should reject bid when amount is lower', () => {
      auctionStateManager.updateBid(auctionId, 150, userId1)
      const success = auctionStateManager.updateBid(auctionId, 140, userId2)
      
      expect(success).toBe(false)
      
      const auction = auctionStateManager.getAuction(auctionId)
      expect(auction?.currentBid).toBe(150)
      expect(auction?.currentWinner).toBe(userId1)
    })

    it('should reject bid when amount is equal', () => {
      auctionStateManager.updateBid(auctionId, 150, userId1)
      const success = auctionStateManager.updateBid(auctionId, 150, userId2)
      
      expect(success).toBe(false)
    })
  })

  describe('Timer Extension', () => {
    it('should extend auction timer', () => {
      const endTime = new Date(Date.now() + 60000)
      auctionStateManager.initAuction(auctionId, 100, endTime)

      auctionStateManager.extendTimer(auctionId, 10)

      const auction = auctionStateManager.getAuction(auctionId)
      expect(auction?.endTime.getTime()).toBe(endTime.getTime() + 10000)
    })
  })

  describe('Participant Management', () => {
    beforeEach(() => {
      const endTime = new Date(Date.now() + 60000)
      auctionStateManager.initAuction(auctionId, 100, endTime)
    })

    it('should add participants', () => {
      auctionStateManager.addParticipant(auctionId, 'socket-1')
      auctionStateManager.addParticipant(auctionId, 'socket-2')

      const count = auctionStateManager.getParticipantCount(auctionId)
      expect(count).toBe(2)
    })

    it('should remove participants', () => {
      auctionStateManager.addParticipant(auctionId, 'socket-1')
      auctionStateManager.addParticipant(auctionId, 'socket-2')
      auctionStateManager.removeParticipant(auctionId, 'socket-1')

      const count = auctionStateManager.getParticipantCount(auctionId)
      expect(count).toBe(1)
    })
  })

  describe('Auction End', () => {
    it('should end auction', () => {
      const endTime = new Date(Date.now() + 60000)
      auctionStateManager.initAuction(auctionId, 100, endTime)

      auctionStateManager.endAuction(auctionId)

      const auction = auctionStateManager.getAuction(auctionId)
      expect(auction?.isEnded).toBe(true)
    })

    it('should reject bids after auction ends', () => {
      const endTime = new Date(Date.now() + 60000)
      auctionStateManager.initAuction(auctionId, 100, endTime)
      auctionStateManager.endAuction(auctionId)

      const success = auctionStateManager.updateBid(auctionId, 150, userId1)
      expect(success).toBe(false)
    })
  })
})
