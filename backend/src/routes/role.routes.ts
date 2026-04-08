import { Router } from 'express';
import { listRoles, getRoleById, applyForRole } from '../controllers/role.controller.js';
import { formRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/', listRoles);
router.get('/:id', getRoleById);
router.post('/apply', formRateLimiter, applyForRole);

export default router;