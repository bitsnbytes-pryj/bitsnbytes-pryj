import { supabase } from '../db/index.js';
import { Role, CreateRoleInput, UpdateRoleInput, ListRolesQuery } from '../types/roles.types.js';
import { PaginatedResult } from '../types/common.types.js';
import { logAudit } from './audit.service.js';

export async function createRole(
  input: CreateRoleInput,
  createdBy: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<Role> {
  const { data, error } = await supabase
    .from('roles')
    .insert({
      title: input.title,
      description: input.description || null,
      department: input.department || null,
      location: input.location || null,
      type: input.type || 'volunteer',
      requirements: input.requirements || [],
      responsibilities: input.responsibilities || [],
      skills_required: input.skills_required || [],
      benefits: input.benefits || [],
      application_deadline: input.application_deadline ? new Date(input.application_deadline) : null,
      vacancies: input.vacancies || null,
      status: input.status || 'draft',
      display_order: input.display_order || 0,
      is_featured: input.is_featured ?? false,
      created_by: createdBy,
    })
    .select()
    .single();
  
  if (error || !data) {
    throw new Error('Failed to create role: ' + (error?.message || 'Unknown error'));
  }
  
  await logAudit({
    adminUserId: createdBy,
    action: 'created',
    entityType: 'role',
    entityId: data.id,
    details: { title: data.title },
    ipAddress,
    userAgent,
  });
  
  return data;
}

export async function listRoles(params: ListRolesQuery): Promise<PaginatedResult<Role>> {
  const { page, limit, status, type, is_featured, search, sort_by, sort_order } = params;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('roles')
    .select('*', { count: 'exact' });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (type) {
    query = query.eq('type', type);
  }
  
  if (is_featured !== undefined) {
    query = query.eq('is_featured', is_featured);
  }
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  
  const { count } = await query;
  const totalItems = count || 0;
  
  const validSortColumns = ['created_at', 'display_order', 'title', 'application_deadline'];
  const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'display_order';
  
  const { data: items, error } = await query
    .order(sortColumn, { ascending: sort_order === 'asc' })
    .range(offset, offset + limit - 1);
  
  if (error) {
    throw new Error('Failed to fetch roles: ' + error.message);
  }
  
  return {
    items: items || [],
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      hasMore: page * limit < totalItems,
    },
  };
}

export async function getRoleById(id: string): Promise<Role | null> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error('Failed to fetch role: ' + error.message);
  }
  
  return data;
}

export async function updateRole(
  id: string,
  input: UpdateRoleInput,
  updatedBy: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<Role | null> {
  const existing = await getRoleById(id);
  if (!existing) return null;
  
  const updateData: Record<string, any> = {};
  const fields = [
    'title', 'description', 'department', 'location', 'type',
    'requirements', 'responsibilities', 'skills_required', 'benefits',
    'application_deadline', 'vacancies', 'status', 'display_order', 'is_featured',
  ];
  
  for (const field of fields) {
    if (field in input && input[field as keyof typeof input] !== undefined) {
      const value = input[field as keyof typeof input];
      updateData[field] = field === 'application_deadline' && value ? new Date(value as string) : value;
    }
  }
  
  if (Object.keys(updateData).length === 0) return existing;
  
  const { data, error } = await supabase
    .from('roles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error('Failed to update role: ' + error.message);
  }
  
  if (data) {
    await logAudit({
      adminUserId: updatedBy,
      action: 'updated',
      entityType: 'role',
      entityId: data.id,
      details: { title: data.title, fields_updated: Object.keys(input) },
      ipAddress,
      userAgent,
    });
  }
  
  return data;
}

export async function deleteRole(
  id: string,
  deletedBy: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<boolean> {
  const existing = await getRoleById(id);
  if (!existing) return false;
  
  await logAudit({
    adminUserId: deletedBy,
    action: 'deleted',
    entityType: 'role',
    entityId: id,
    details: { title: existing.title },
    ipAddress,
    userAgent,
  });
  
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id);
  
  return !error;
}