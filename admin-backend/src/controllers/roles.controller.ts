import { Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  createRole,
  listRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from '../services/roles.service.js';
import { successResponses, errorResponses } from '../utils/response.js';
import { createRoleSchema, updateRoleSchema, listRolesQuerySchema } from '../types/roles.types.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

function getClientIp(req: Request): string | null {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() 
    || req.socket?.remoteAddress 
    || null;
}

function getUserAgent(req: Request): string | null {
  return req.headers['user-agent'] || null;
}

export async function createRoleController(req: Request, res: Response): Promise<void> {
  try {
    const input = createRoleSchema.parse(req.body);
    const authReq = req as AuthenticatedRequest;
    
    const role = await createRole(input, authReq.user.id, getClientIp(req), getUserAgent(req));
    successResponses.created(res, role);
  } catch (error) {
    if (error instanceof ZodError) {
      errorResponses.validationError(res, {
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
      });
      return;
    }
    console.error('Create role error:', error);
    errorResponses.internalError(res, 'Failed to create role');
  }
}

export async function listRolesController(req: Request, res: Response): Promise<void> {
  try {
    const query = listRolesQuerySchema.parse(req.query);
    const result = await listRoles(query);
    successResponses.paginated(res, result.items, result.pagination.page, result.pagination.limit, result.pagination.totalItems);
  } catch (error) {
    if (error instanceof ZodError) {
      errorResponses.validationError(res, {
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
      });
      return;
    }
    console.error('List roles error:', error);
    errorResponses.internalError(res, 'Failed to list roles');
  }
}

export async function getRoleController(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const role = await getRoleById(id);
    if (!role) {
      errorResponses.notFound(res, 'Role not found');
      return;
    }
    successResponses.ok(res, role);
  } catch (error) {
    console.error('Get role error:', error);
    errorResponses.internalError(res, 'Failed to get role');
  }
}

export async function updateRoleController(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const input = updateRoleSchema.parse(req.body);
    const authReq = req as AuthenticatedRequest;
    
    const role = await updateRole(id, input, authReq.user.id, getClientIp(req), getUserAgent(req));
    if (!role) {
      errorResponses.notFound(res, 'Role not found');
      return;
    }
    successResponses.ok(res, role);
  } catch (error) {
    if (error instanceof ZodError) {
      errorResponses.validationError(res, {
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
      });
      return;
    }
    console.error('Update role error:', error);
    errorResponses.internalError(res, 'Failed to update role');
  }
}

export async function deleteRoleController(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;
    
    const deleted = await deleteRole(id, authReq.user.id, getClientIp(req), getUserAgent(req));
    if (!deleted) {
      errorResponses.notFound(res, 'Role not found');
      return;
    }
    successResponses.noContent(res);
  } catch (error) {
    console.error('Delete role error:', error);
    errorResponses.internalError(res, 'Failed to delete role');
  }
}