import mongoose, { Schema, Document } from 'mongoose'

export interface IBid extends Document {
  auctionId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  username: string
  amount: number
  status: 'accepted' | 'rejected'
  createdAt: Date
}

const BidSchema: Schema = new Schema({
  auctionId: { type: Schema.Types.ObjectId, ref: 'Auction', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['accepted', 'rejected'], default: 'accepted' },
  createdAt: { type: Date, default: Date.now, immutable: true }
})

BidSchema.index({ auctionId: 1, createdAt: -1 })

export default mongoose.model<IBid>('Bid', BidSchema)
