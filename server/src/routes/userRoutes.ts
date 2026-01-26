import { Router } from 'express'
import * as userController from '../controllers/userController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/profile', authMiddleware, userController.getProfile)
router.post('/topup', authMiddleware, userController.topUpWallet)

export default router
