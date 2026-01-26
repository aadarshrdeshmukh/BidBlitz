import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer | undefined

beforeAll(async () => {
  try {
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }

    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
  } catch (error) {
    console.error('Error in beforeAll:', error)
    throw error
  }
}, 60000)

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }
    if (mongoServer) {
      await mongoServer.stop()
    }
  } catch (error) {
    console.error('Error in afterAll:', error)
  }
}, 60000)

afterEach(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      const collections = mongoose.connection.collections
      for (const key in collections) {
        await collections[key].deleteMany({})
      }
    }
  } catch (error) {
    console.error('Error in afterEach:', error)
  }
})
