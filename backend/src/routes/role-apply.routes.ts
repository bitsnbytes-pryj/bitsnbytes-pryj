import { Router } from 'express';
import { applyForRole } from '../controllers/role.controller.js';
import { formRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', formRateLimiter, applyForRole);

export default router;