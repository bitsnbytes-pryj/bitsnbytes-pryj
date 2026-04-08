import { supabase } from '../config/supabase.js';
import { RoleApplyInput, RequestMeta, Role } from '../types/index.js';
import { sendFormEmails } from './email.service.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all active roles
export async function getRoles(): Promise<Role[]> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Failed to fetch roles', { error: error.message });
    throw new AppError('Failed to fetch roles', 500);
  }

  return data as Role[];
}

// Get single role by ID or slug
export async function getRole(idOrSlug: string): Promise<Role | null> {
  // Check if it's a UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

  const field = isUuid ? 'id' : 'slug';
  
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq(field, idOrSlug)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    logger.error('Failed to fetch role', { error: error.message });
    throw new AppError('Failed to fetch role', 500);
  }

  return data as Role;
}

// Create role application
export async function createRoleApplication(
  input: RoleApplyInput,
  meta: RequestMeta
): Promise<{ id: string }> {
  // Check if role exists
  const role = await getRole(input.role_id);
  if (!role) {
    throw new AppError('Role not found', 404);
  }

  // Insert application
  const { data, error } = await supabase
    .from('role_applications')
    .insert({
      role_id: input.role_id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      portfolio_url: input.portfolio_url,
      resume_url: input.resume_url,
      cover_letter: input.cover_letter,
      linkedin_url: input.linkedin_url,
      availability: input.availability,
      ip_address: meta.ip_address,
      user_agent: meta.user_agent,
    })
    .select('id')
    .single();

  if (error) {
    logger.error('Failed to save role application', { error: error.message });
    throw new Error('Failed to save role application');
  }

  // Send emails (non-blocking)
  sendFormEmails(
    'Role Application',
    {
      Role: role.title,
      Name: input.name,
      Email: input.email,
      Phone: input.phone || 'Not provided',
      Portfolio: input.portfolio_url,
      Resume: input.resume_url,
      LinkedIn: input.linkedin_url,
      Availability: input.availability,
      'Cover Letter': input.cover_letter ? input.cover_letter.substring(0, 200) + '...' : 'Not provided',
    },
    input.email,
    input.name
  ).catch((err) => {
    logger.error('Email sending failed for role application', { error: err });
  });

  return { id: data.id };
}