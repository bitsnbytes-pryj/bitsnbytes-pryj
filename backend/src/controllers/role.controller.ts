import { Request, Response, NextFunction } from 'express';
import { getRoles, getRole, createRoleApplication } from '../services/role.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { roleApplySchema } from '../types/index.js';

export async function listRoles(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const roles = await getRoles();
    res.json(successResponse(roles));
  } catch (error) {
    next(error);
  }
}

export async function getRoleById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const role = await getRole(id);

    if (!role) {
      res.status(404).json(errorResponse('Role not found'));
      return;
    }

    res.json(successResponse(role));
  } catch (error) {
    next(error);
  }
}

export async function applyForRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = roleApplySchema.parse(req.body);
    
    const meta = {
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.get('user-agent') || 'unknown',
    };

    const result = await createRoleApplication(input, meta);

    res.status(201).json(successResponse({
      id: result.id,
      message: 'Your application has been submitted successfully!',
    }));
  } catch (error) {
    next(error);
  }
}