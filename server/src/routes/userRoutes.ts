import { Router } from 'express'
import * as userController from '../controllers/userController'
import { authMiddleware, requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { registerSchema, loginSchema, topUpSchema } from '../schemas/userSchema'
import { authRateLimiter } from '../middleware/rateLimiter'

const router = Router()

// Public auth routes
router.post('/register', authRateLimiter, validate(registerSchema), userController.register)
router.post('/login', authRateLimiter, validate(loginSchema), userController.login)

// Protected routes
router.use(authMiddleware)
router.get('/profile', requireAuth, userController.getProfile)
router.post('/topup', requireAuth, validate(topUpSchema), userController.topUpWallet)

export default router
