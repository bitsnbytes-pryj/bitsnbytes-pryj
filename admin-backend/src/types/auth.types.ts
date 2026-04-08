import { z } from 'zod';

// Admin user database type
export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

// Login request validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Login response
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
  expiresAt: Date;
}

// Create admin user validation
export const createAdminUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100),
  role: z.enum(['admin', 'super_admin']).default('admin'),
});

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;

// Update admin user validation
export const updateAdminUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  name: z.string().min(1, 'Name is required').max(100).optional(),
  role: z.enum(['admin', 'super_admin']).optional(),
  is_active: z.boolean().optional(),
});

export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;

// JWT payload
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}