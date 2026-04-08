import { Router } from 'express';
import {
  createEventController,
  listEventsController,
  getEventController,
  updateEventController,
  deleteEventController,
} from '../controllers/events.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All routes are protected
router.use(authMiddleware);

router.get('/', listEventsController);
router.get('/:id', getEventController);
router.post('/', createEventController);
router.put('/:id', updateEventController);
router.delete('/:id', deleteEventController);

export default router;