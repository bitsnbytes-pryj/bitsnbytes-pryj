import { Router } from 'express';
import { createTeamMemberController, listTeamMembersController, getTeamMemberController, updateTeamMemberController, deleteTeamMemberController } from '../controllers/team.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', listTeamMembersController);
router.get('/:id', getTeamMemberController);
router.post('/', createTeamMemberController);
router.put('/:id', updateTeamMemberController);
router.delete('/:id', deleteTeamMemberController);

export default router;