import request from 'supertest'
import express from 'express'
import auctionRoutes from '../routes/auctionRoutes'
import userRoutes from '../routes/userRoutes'
import Auction from '../models/Auction'
import Bid from '../models/Bid'

const app = express()
app.use(express.json())
app.use('/api/auctions', auctionRoutes)
app.use('/api/users', userRoutes)

describe('Auction API Tests', () => {
  let token: string
  let userId: string

  beforeEach(async () => {
    // Create a unique email for each test to avoid conflicts
    const uniqueEmail = `test${Date.now()}@example.com`
    const response = await request(app)
      .post('/api/users/register')
      .send({
        email: uniqueEmail,
        password: 'password123',
        username: `testuser${Date.now()}`
      })
    token = response.body.token
    userId = response.body.user.id
  })

  describe('POST /api/auctions', () => {
    it('should create a new auction', async () => {
      const response = await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Vintage Watch',
          description: 'A beautiful vintage watch',
          startingBid: 100,
          durationMinutes: 60
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.auction.title).toBe('Vintage Watch')
      expect(response.body.auction.startingBid).toBe(100)
      expect(response.body.auction.currentBid).toBe(100)
      expect(response.body.auction.status).toBe('active')
    })

    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Vintage Watch'
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/auctions')
        .send({
          title: 'Vintage Watch',
          description: 'A beautiful vintage watch',
          startingBid: 100,
          durationMinutes: 60
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Authentication required')
    })
  })

  describe('GET /api/auctions', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Auction 1',
          description: 'Description 1',
          startingBid: 100,
          durationMinutes: 60
        })

      await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Auction 2',
          description: 'Description 2',
          startingBid: 200,
          durationMinutes: 30
        })
    })

    it('should fetch all auctions', async () => {
      const response = await request(app)
        .get('/api/auctions')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.auctions).toHaveLength(2)
    })

    it('should filter auctions by status', async () => {
      const response = await request(app)
        .get('/api/auctions?status=active')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.auctions.length).toBeGreaterThan(0)
      expect(response.body.auctions[0].status).toBe('active')
    })
  })

  describe('GET /api/auctions/:id', () => {
    let auctionId: string

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Auction',
          description: 'Test Description',
          startingBid: 100,
          durationMinutes: 60
        })
      auctionId = response.body.auction._id
    })

    it('should fetch auction by id', async () => {
      const response = await request(app)
        .get(`/api/auctions/${auctionId}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.auction.title).toBe('Test Auction')
      expect(response.body.bids).toBeDefined()
    })

    it('should return 404 for non-existent auction', async () => {
      const fakeId = '507f1f77bcf86cd799439011'
      const response = await request(app)
        .get(`/api/auctions/${fakeId}`)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/auctions/:id/bids', () => {
    let auctionId: string

    beforeEach(async () => {
      const auctionResponse = await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Auction',
          description: 'Test Description',
          startingBid: 100,
          durationMinutes: 60
        })
      auctionId = auctionResponse.body.auction._id

      // Create some bids
      await Bid.create({
        auctionId,
        userId,
        username: 'testuser',
        amount: 150,
        status: 'accepted'
      })

      await Bid.create({
        auctionId,
        userId,
        username: 'testuser',
        amount: 200,
        status: 'accepted'
      })
    })

    it('should fetch bid history', async () => {
      const response = await request(app)
        .get(`/api/auctions/${auctionId}/bids`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.bids).toHaveLength(2)
      expect(response.body.bids[0].amount).toBe(200) // Most recent first
    })

    it('should limit bid history', async () => {
      const response = await request(app)
        .get(`/api/auctions/${auctionId}/bids?limit=1`)

      expect(response.status).toBe(200)
      expect(response.body.bids).toHaveLength(1)
    })
  })
})
