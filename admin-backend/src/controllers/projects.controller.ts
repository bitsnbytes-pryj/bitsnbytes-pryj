import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createProject, listProjects, getProjectById, updateProject, deleteProject } from '../services/projects.service.js';
import { successResponses, errorResponses } from '../utils/response.js';
import { createProjectSchema, updateProjectSchema, listProjectsQuerySchema } from '../types/projects.types.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

function getClientIp(req: Request): string | null {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;
}
function getUserAgent(req: Request): string | null { return req.headers['user-agent'] || null; }

export async function createProjectController(req: Request, res: Response): Promise<void> {
  try {
    const input = createProjectSchema.parse(req.body);
    const authReq = req as AuthenticatedRequest;
    const project = await createProject(input, authReq.user.id, getClientIp(req), getUserAgent(req));
    successResponses.created(res, project);
  } catch (error) {
    if (error instanceof ZodError) { errorResponses.validationError(res, { errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) }); return; }
    console.error('Create project error:', error);
    errorResponses.internalError(res, 'Failed to create project');
  }
}

export async function listProjectsController(req: Request, res: Response): Promise<void> {
  try {
    const query = listProjectsQuerySchema.parse(req.query);
    const result = await listProjects(query);
    successResponses.paginated(res, result.items, result.pagination.page, result.pagination.limit, result.pagination.totalItems);
  } catch (error) {
    if (error instanceof ZodError) { errorResponses.validationError(res, { errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) }); return; }
    console.error('List projects error:', error);
    errorResponses.internalError(res, 'Failed to list projects');
  }
}

export async function getProjectController(req: Request, res: Response): Promise<void> {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) { errorResponses.notFound(res, 'Project not found'); return; }
    successResponses.ok(res, project);
  } catch (error) {
    console.error('Get project error:', error);
    errorResponses.internalError(res, 'Failed to get project');
  }
}

export async function updateProjectController(req: Request, res: Response): Promise<void> {
  try {
    const input = updateProjectSchema.parse(req.body);
    const authReq = req as AuthenticatedRequest;
    const project = await updateProject(req.params.id, input, authReq.user.id, getClientIp(req), getUserAgent(req));
    if (!project) { errorResponses.notFound(res, 'Project not found'); return; }
    successResponses.ok(res, project);
  } catch (error) {
    if (error instanceof ZodError) { errorResponses.validationError(res, { errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) }); return; }
    console.error('Update project error:', error);
    errorResponses.internalError(res, 'Failed to update project');
  }
}

export async function deleteProjectController(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const deleted = await deleteProject(req.params.id, authReq.user.id, getClientIp(req), getUserAgent(req));
    if (!deleted) { errorResponses.notFound(res, 'Project not found'); return; }
    successResponses.noContent(res);
  } catch (error) {
    console.error('Delete project error:', error);
    errorResponses.internalError(res, 'Failed to delete project');
  }
}