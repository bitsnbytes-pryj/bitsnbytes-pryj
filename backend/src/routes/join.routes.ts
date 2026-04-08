import { Router } from 'express';
import { submitJoin } from '../controllers/join.controller.js';
import { formRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', formRateLimiter, submitJoin);

export default router;