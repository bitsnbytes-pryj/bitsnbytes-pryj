import { Router } from 'express';
import { submitContact } from '../controllers/contact.controller.js';
import { formRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', formRateLimiter, submitContact);

export default router;