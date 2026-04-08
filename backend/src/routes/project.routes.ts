import { Router } from 'express';
import { listProjects, getProjectById } from '../controllers/project.controller.js';

const router = Router();

router.get('/', listProjects);
router.get('/:id', getProjectById);

export default router;