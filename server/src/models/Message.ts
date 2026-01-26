import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage extends Document {
    auctionId: mongoose.Types.ObjectId
    senderId: mongoose.Types.ObjectId
    receiverId: mongoose.Types.ObjectId
    content: string
    createdAt: Date
}

const MessageSchema: Schema = new Schema({
    auctionId: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IMessage>('Message', MessageSchema)
