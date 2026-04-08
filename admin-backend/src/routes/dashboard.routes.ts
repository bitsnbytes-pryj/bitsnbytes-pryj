import { Router } from 'express';
import { getDashboardStatsController, healthCheckController } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Health check is public
router.get('/health', healthCheckController);

// Stats requires auth
router.get('/stats', authMiddleware, getDashboardStatsController);

export default router;