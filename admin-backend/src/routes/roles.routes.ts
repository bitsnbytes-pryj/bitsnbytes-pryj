import { Router } from 'express';
import {
  createRoleController,
  listRolesController,
  getRoleController,
  updateRoleController,
  deleteRoleController,
} from '../controllers/roles.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', listRolesController);
router.get('/:id', getRoleController);
router.post('/', createRoleController);
router.put('/:id', updateRoleController);
router.delete('/:id', deleteRoleController);

export default router;