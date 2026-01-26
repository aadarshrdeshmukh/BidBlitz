import request from 'supertest'
import express from 'express'
import userRoutes from '../routes/userRoutes'
import User from '../models/User'

const app = express()
app.use(express.json())
app.use('/api/users', userRoutes)

describe('User API Tests', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const uniqueEmail = `test${Date.now()}@example.com`
      const response = await request(app)
        .post('/api/users/register')
        .send({
          email: uniqueEmail,
          password: 'password123',
          username: `testuser${Date.now()}`
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.token).toBeDefined()
      expect(response.body.user.email).toBe(uniqueEmail)
    })

    it('should fail with missing fields', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          email: 'test@example.com'
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })

    it('should fail with duplicate email', async () => {
      const uniqueEmail = `duplicate${Date.now()}@example.com`
      
      await request(app)
        .post('/api/users/register')
        .send({
          email: uniqueEmail,
          password: 'password123',
          username: `testuser${Date.now()}`
        })

      const response = await request(app)
        .post('/api/users/register')
        .send({
          email: uniqueEmail,
          password: 'password456',
          username: `testuser2${Date.now()}`
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toContain('already exists')
    })
  })

  describe('POST /api/users/login', () => {
    let testEmail: string

    beforeEach(async () => {
      testEmail = `login${Date.now()}@example.com`
      await request(app)
        .post('/api/users/register')
        .send({
          email: testEmail,
          password: 'password123',
          username: `testuser${Date.now()}`
        })
    })

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testEmail,
          password: 'password123'
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.token).toBeDefined()
      expect(response.body.user.email).toBe(testEmail)
    })

    it('should fail with invalid password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testEmail,
          password: 'wrongpassword'
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid credentials')
    })

    it('should fail with non-existent user', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/users/profile', () => {
    let token: string
    let testEmail: string

    beforeEach(async () => {
      testEmail = `profile${Date.now()}@example.com`
      const response = await request(app)
        .post('/api/users/register')
        .send({
          email: testEmail,
          password: 'password123',
          username: `testuser${Date.now()}`
        })
      token = response.body.token
    })

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.user.email).toBe(testEmail)
    })

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/users/profile')

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Authentication required')
    })
  })
})
