import { supabase } from '../db/index.js';
import { hashPassword, comparePassword } from '../auth/hash.js';
import { generateToken, getTokenExpiration } from '../auth/jwt.js';
import { AdminUser, LoginInput, LoginResponse, CreateAdminUserInput } from '../types/auth.types.js';
import { logAudit } from './audit.service.js';

// Find admin user by email
export async function findAdminUserByEmail(email: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  
  return data;
}

// Find admin user by ID
export async function findAdminUserById(id: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  
  return data;
}

// Login admin user
export async function loginAdmin(
  input: LoginInput,
  ipAddress: string | null,
  userAgent: string | null
): Promise<LoginResponse | null> {
  const user = await findAdminUserByEmail(input.email);
  
  if (!user) {
    // Log failed login attempt
    await logAudit({
      adminUserId: null,
      action: 'login_failed',
      entityType: 'admin_user',
      entityId: null,
      details: { email: input.email, reason: 'user_not_found' },
      ipAddress,
      userAgent,
    });
    return null;
  }
  
  const isValidPassword = await comparePassword(input.password, user.password_hash);
  
  if (!isValidPassword) {
    // Log failed login attempt
    await logAudit({
      adminUserId: user.id,
      action: 'login_failed',
      entityType: 'admin_user',
      entityId: user.id,
      details: { reason: 'invalid_password' },
      ipAddress,
      userAgent,
    });
    return null;
  }
  
  if (!user.is_active) {
    // Log failed login attempt
    await logAudit({
      adminUserId: user.id,
      action: 'login_failed',
      entityType: 'admin_user',
      entityId: user.id,
      details: { reason: 'account_inactive' },
      ipAddress,
      userAgent,
    });
    return null;
  }
  
  // Update last login time
  await supabase
    .from('admin_users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', user.id);
  
  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  
  // Log successful login
  await logAudit({
    adminUserId: user.id,
    action: 'login_success',
    entityType: 'admin_user',
    entityId: user.id,
    details: null,
    ipAddress,
    userAgent,
  });
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
    expiresAt: getTokenExpiration(token)!,
  };
}

// Create admin user (for super admins)
export async function createAdminUser(
  input: CreateAdminUserInput,
  createdBy: string
): Promise<AdminUser> {
  const existingUser = await findAdminUserByEmail(input.email);
  
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  const passwordHash = await hashPassword(input.password);
  
  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      email: input.email.toLowerCase(),
      password_hash: passwordHash,
      name: input.name,
      role: input.role,
    })
    .select()
    .single();
  
  if (error || !data) {
    throw new Error('Failed to create admin user: ' + (error?.message || 'Unknown error'));
  }
  
  // Log creation
  await logAudit({
    adminUserId: createdBy,
    action: 'created',
    entityType: 'admin_user',
    entityId: data.id,
    details: { email: data.email, name: data.name, role: data.role },
    ipAddress: null,
    userAgent: null,
  });
  
  return data;
}

// Get admin user without sensitive data
export function sanitizeAdminUser(user: AdminUser) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    is_active: user.is_active,
    last_login_at: user.last_login_at,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}