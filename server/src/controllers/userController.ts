import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, username } = req.body

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and username are required'
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      email,
      password: hashedPassword,
      username
    })

    await user.save()

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        balance: user.balance
      }
    })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ success: false, message: 'Failed to register user' })
  }
}

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        balance: user.balance
      }
    })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ success: false, message: 'Failed to login' })
  }
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const user = await User.findById(userId).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        balance: user.balance,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch profile' })
  }
}

export const topUpWallet = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    const { amount } = req.body

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid top-up amount' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    user.balance += Number(amount)
    await user.save()

    res.json({
      success: true,
      message: `Successfully topped up $${amount}`,
      balance: user.balance
    })
  } catch (error) {
    console.error('Error topping up wallet:', error)
    res.status(500).json({ success: false, message: 'Failed to top up wallet' })
  }
}
