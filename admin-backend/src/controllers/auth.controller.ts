import { Request, Response } from 'express';
import { loginAdmin, findAdminUserById, sanitizeAdminUser } from '../services/auth.service.js';
import { successResponses, errorResponses } from '../utils/response.js';
import { loginSchema } from '../types/auth.types.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ZodError } from 'zod';

// Get client IP from request
function getClientIp(req: Request): string | null {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() 
    || req.socket?.remoteAddress 
    || null;
}

// Get user agent from request
function getUserAgent(req: Request): string | null {
  return req.headers['user-agent'] || null;
}

// Login handler
export async function loginController(req: Request, res: Response): Promise<void> {
  try {
    // Validate input
    const input = loginSchema.parse(req.body);
    
    // Attempt login
    const result = await loginAdmin(
      input,
      getClientIp(req),
      getUserAgent(req)
    );
    
    if (!result) {
      errorResponses.unauthorized(res, 'Invalid email or password');
      return;
    }
    
    successResponses.ok(res, result);
  } catch (error) {
    if (error instanceof ZodError) {
      errorResponses.validationError(res, { 
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }
    
    console.error('Login error:', error);
    errorResponses.internalError(res, 'Login failed');
  }
}

// Get current user handler
export async function getCurrentUserController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    
    const user = await findAdminUserById(userId);
    
    if (!user) {
      errorResponses.unauthorized(res, 'User not found');
      return;
    }
    
    successResponses.ok(res, sanitizeAdminUser(user));
  } catch (error) {
    console.error('Get current user error:', error);
    errorResponses.internalError(res, 'Failed to get user');
  }
}

// Logout handler (primarily for audit logging, since JWTs are stateless)
export async function logoutController(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    // Since JWT is stateless, we just return success
    // In a more complex setup, you might want to maintain a token blacklist
    successResponses.ok(res, { message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    errorResponses.internalError(res, 'Logout failed');
  }
}
