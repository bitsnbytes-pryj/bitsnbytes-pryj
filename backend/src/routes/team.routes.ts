import { Router } from 'express';
import { listTeam } from '../controllers/team.controller.js';

const router = Router();

router.get('/', listTeam);

export default router;