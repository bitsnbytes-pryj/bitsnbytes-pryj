import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractBearerToken } from '../auth/jwt.js';
import { supabase } from '../db/index.js';

// Extend Request type for authenticated routes
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Authentication middleware
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractBearerToken(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No token provided',
      });
      return;
    }
    
    const payload = verifyToken(token);
    
    if (!payload) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
      return;
    }
    
    // Verify user still exists and is active
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, email, role, is_active')
      .eq('id', payload.userId)
      .single();
    
    if (error || !user || !user.is_active) {
      res.status(401).json({
        success: false,
        error: 'User not found or inactive',
      });
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
    res.status(401).json({
      success: false,
      error: 'Authentication failed',
    });
  }
}

// Role-based authorization middleware
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
      return;
    }
    
    if (!roles.includes(user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }
    
    next();
  };
}

// Super admin only middleware
export const requireSuperAdmin = requireRole('super_admin');

// Webhook API key middleware
export function webhookAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const apiKey = req.headers['x-webhook-key'];
  
  // Import config dynamically to avoid circular dependency
  import('../config/index.js').then(({ config }) => {
    if (!apiKey || apiKey !== config.webhookApiKey) {
      res.status(401).json({
        success: false,
        error: 'Invalid webhook API key',
      });
      return;
    }
    next();
  });
}