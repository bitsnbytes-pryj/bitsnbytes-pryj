import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createTeamMember, listTeamMembers, getTeamMemberById, updateTeamMember, deleteTeamMember } from '../services/team.service.js';
import { successResponses, errorResponses } from '../utils/response.js';
import { createTeamMemberSchema, updateTeamMemberSchema, listTeamMembersQuerySchema } from '../types/team.types.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

function getClientIp(req: Request): string | null {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;
}

function getUserAgent(req: Request): string | null {
  return req.headers['user-agent'] || null;
}

export async function createTeamMemberController(req: Request, res: Response): Promise<void> {
  try {
    const input = createTeamMemberSchema.parse(req.body);
    const authReq = req as AuthenticatedRequest;
    const member = await createTeamMember(input, authReq.user.id, getClientIp(req), getUserAgent(req));
    successResponses.created(res, member);
  } catch (error) {
    if (error instanceof ZodError) {
      errorResponses.validationError(res, { errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) });
      return;
    }
    console.error('Create team member error:', error);
    errorResponses.internalError(res, 'Failed to create team member');
  }
}

export async function listTeamMembersController(req: Request, res: Response): Promise<void> {
  try {
    const query = listTeamMembersQuerySchema.parse(req.query);
    const result = await listTeamMembers(query);
    successResponses.paginated(res, result.items, result.pagination.page, result.pagination.limit, result.pagination.totalItems);
  } catch (error) {
    if (error instanceof ZodError) {
      errorResponses.validationError(res, { errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) });
      return;
    }
    console.error('List team members error:', error);
    errorResponses.internalError(res, 'Failed to list team members');
  }
}

export async function getTeamMemberController(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const member = await getTeamMemberById(id);
    if (!member) { errorResponses.notFound(res, 'Team member not found'); return; }
    successResponses.ok(res, member);
  } catch (error) {
    console.error('Get team member error:', error);
    errorResponses.internalError(res, 'Failed to get team member');
  }
}

export async function updateTeamMemberController(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const input = updateTeamMemberSchema.parse(req.body);
    const authReq = req as AuthenticatedRequest;
    const member = await updateTeamMember(id, input, authReq.user.id, getClientIp(req), getUserAgent(req));
    if (!member) { errorResponses.notFound(res, 'Team member not found'); return; }
    successResponses.ok(res, member);
  } catch (error) {
    if (error instanceof ZodError) {
      errorResponses.validationError(res, { errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) });
      return;
    }
    console.error('Update team member error:', error);
    errorResponses.internalError(res, 'Failed to update team member');
  }
}

export async function deleteTeamMemberController(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;
    const deleted = await deleteTeamMember(id, authReq.user.id, getClientIp(req), getUserAgent(req));
    if (!deleted) { errorResponses.notFound(res, 'Team member not found'); return; }
    successResponses.noContent(res);
  } catch (error) {
    console.error('Delete team member error:', error);
    errorResponses.internalError(res, 'Failed to delete team member');
  }
}