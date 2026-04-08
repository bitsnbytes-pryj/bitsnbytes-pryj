import { Router } from 'express';
import { listEvents, getEventById, registerForEvent } from '../controllers/event.controller.js';
import { formRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/', listEvents);
router.get('/:id', getEventById);
router.post('/register', formRateLimiter, registerForEvent);

export default router;