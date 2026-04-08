import { Router } from 'express';
import { submitFeedback } from '../controllers/feedback.controller.js';
import { formRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', formRateLimiter, submitFeedback);

export default router;