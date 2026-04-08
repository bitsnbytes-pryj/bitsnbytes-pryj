import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { loginController, getCurrentUserController, logoutController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import config from '../config/index.js';

const router = Router();

// Login rate limiter (more restrictive)
const loginLimiter = rateLimit({
  windowMs: config.loginRateLimit.windowMs,
  max: config.loginRateLimit.maxRequests,
  message: {
    success: false,
    error: 'Too many login attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/login', loginLimiter, loginController);

// Protected routes
router.get('/me', authMiddleware, getCurrentUserController);
router.post('/logout', authMiddleware, logoutController);

export default router;