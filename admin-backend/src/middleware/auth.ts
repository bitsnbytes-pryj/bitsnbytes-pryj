import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractBearerToken } from '../auth/jwt.js';
import { errorResponses } from '../utils/response.js';
import { AuthenticatedRequest } from '../types/common.types.js';
import { queryOne } from '../db/index.js';

// Extend Request type for authenticated routes
export type { AuthenticatedRequest };

// Authentication middleware
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractBearerToken(req.headers.authorization);
    
    if (!token) {
      errorResponses.unauthorized(res, 'No token provided');
      return;
    }
    
    const payload = verifyToken(token);
    
    if (!payload) {
      errorResponses.unauthorized(res, 'Invalid or expired token');
      return;
    }
    
    // Verify user still exists and is active
    const user = await queryOne<{ id: string; email: string; role: string; is_active: boolean }>(
      'SELECT id, email, role, is_active FROM admin_users WHERE id = $1',
      [payload.userId]
    );
    
    if (!user || !user.is_active) {
      errorResponses.unauthorized(res, 'User not found or inactive');
      return;
    }
    
    // Attach user to request
    (req as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    
    next();
  } catch (error) {
    errorResponses.unauthorized(res, 'Authentication failed');
  }
}

// Optional: Role-based authorization middleware
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;
    
    if (!user) {
      errorResponses.unauthorized(res, 'Not authenticated');
      return;
    }
    
    if (!roles.includes(user.role)) {
      errorResponses.forbidden(res, 'Insufficient permissions');
      return;
    }
    
    next();
  };
}

// Optional: Super admin only middleware
export const requireSuperAdmin = requireRole('super_admin');