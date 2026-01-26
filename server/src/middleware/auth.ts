import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    // Allow request to proceed without userId for optional auth
    req.userId = undefined
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { userId: string }
    req.userId = decoded.userId
    next()
  } catch (error) {
    // Invalid token - allow request to proceed
    req.userId = undefined
    next()
  }
}
