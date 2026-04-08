import { Router } from 'express';
import { registerForEvent } from '../controllers/event.controller.js';
import { formRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', formRateLimiter, registerForEvent);

export default router;