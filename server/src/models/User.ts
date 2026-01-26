import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  username: string
  balance: number
  createdAt: Date
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  balance: { type: Number, default: 5000 }, // Default $5000 for demo
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IUser>('User', UserSchema)
