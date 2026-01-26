import mongoose, { Schema, Document } from 'mongoose'

export interface IAuction extends Document {
  title: string
  description: string
  imageUrl?: string
  category: string
  startingBid: number
  minIncrement: number
  currentBid: number
  currentWinner?: mongoose.Types.ObjectId
  startTime: Date
  endTime: Date
  status: 'pending' | 'active' | 'ended'
  auctionType: 'regular' | 'rapid'
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
}

const AuctionSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  category: {
    type: String,
    enum: ['Electronics', 'Fashion', 'Collectibles', 'Art', 'Sports', 'Home', 'Automotive', 'Other'],
    default: 'Other'
  },
  startingBid: { type: Number, required: true },
  minIncrement: { type: Number, default: 1 },
  currentBid: { type: Number, required: true },
  currentWinner: { type: Schema.Types.ObjectId, ref: 'User' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'active', 'ended'], default: 'pending' },
  auctionType: { type: String, enum: ['regular', 'rapid'], default: 'regular' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IAuction>('Auction', AuctionSchema)
