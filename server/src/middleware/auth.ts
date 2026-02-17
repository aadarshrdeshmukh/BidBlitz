import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
}

/**
 * Middleware to extract user from JWT.
 * It does NOT block requests if token is missing or invalid.
 * It only populates req.userId if a valid token is present.
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

  if (!token) {
    req.userId = undefined
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    req.userId = decoded.userId
    next()
  } catch (error) {
    // Invalid token - clear userId and proceed
    req.userId = undefined
    next()
  }
}

/**
 * Middleware to ensure a user is authenticated.
 * Use this after authMiddleware to protect routes.
 */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please provide a valid token.',
    });
  }
  next();
};
