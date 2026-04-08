import { Router } from 'express';
import { createProjectController, listProjectsController, getProjectController, updateProjectController, deleteProjectController } from '../controllers/projects.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', listProjectsController);
router.get('/:id', getProjectController);
router.post('/', createProjectController);
router.put('/:id', updateProjectController);
router.delete('/:id', deleteProjectController);

export default router;