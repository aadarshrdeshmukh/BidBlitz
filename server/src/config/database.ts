import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }

    console.log('Attempting to connect to MongoDB...')
    const conn = await mongoose.connect(uri)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error: any) {
    console.error('❌ MongoDB connection error details:')
    console.error(`Message: ${error.message}`)
    if (error.name === 'MongoParseError') {
      console.error('Hint: Check if your MONGODB_URI format is correct (include credentials and cluster name).')
    } else if (error.name === 'MongoNetworkError') {
      console.error('Hint: This is often an IP whitelist issue. Ensure Render IPs are allowed in MongoDB Atlas.')
    }
    process.exit(1)
  }
}
