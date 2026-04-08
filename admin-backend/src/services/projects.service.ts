import { supabase } from '../db/index.js';
import { Project, CreateProjectInput, UpdateProjectInput, ListProjectsQuery } from '../types/projects.types.js';
import { PaginatedResult } from '../types/common.types.js';
import { logAudit } from './audit.service.js';

export async function createProject(
  input: CreateProjectInput,
  createdBy: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: input.title,
      description: input.description || null,
      short_description: input.short_description || null,
      image_url: input.image_url || null,
      github_url: input.github_url || null,
      demo_url: input.demo_url || null,
      technologies: input.technologies || [],
      category: input.category || null,
      status: input.status || 'draft',
      display_order: input.display_order || 0,
      is_featured: input.is_featured ?? false,
      team_members: input.team_members || [],
      started_at: input.started_at ? new Date(input.started_at) : null,
      completed_at: input.completed_at ? new Date(input.completed_at) : null,
      created_by: createdBy,
    })
    .select()
    .single();
  
  if (error || !data) {
    throw new Error('Failed to create project: ' + (error?.message || 'Unknown error'));
  }
  
  await logAudit({
    adminUserId: createdBy,
    action: 'created',
    entityType: 'project',
    entityId: data.id,
    details: { title: data.title },
    ipAddress,
    userAgent,
  });
  
  return data;
}

export async function listProjects(params: ListProjectsQuery): Promise<PaginatedResult<Project>> {
  const { page, limit, status, is_featured, search, sort_by, sort_order } = params;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('projects')
    .select('*', { count: 'exact' });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (is_featured !== undefined) {
    query = query.eq('is_featured', is_featured);
  }
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  
  const { count } = await query;
  const totalItems = count || 0;
  
  const validSortColumns = ['created_at', 'display_order', 'title'];
  const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'display_order';
  
  const { data: items, error } = await query
    .order(sortColumn, { ascending: sort_order === 'asc' })
    .range(offset, offset + limit - 1);
  
  if (error) {
    throw new Error('Failed to fetch projects: ' + error.message);
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

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error('Failed to fetch project: ' + error.message);
  }
  
  return data;
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput,
  updatedBy: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<Project | null> {
  const existing = await getProjectById(id);
  if (!existing) return null;
  
  const updateData: Record<string, any> = {};
  const fields = [
    'title', 'description', 'short_description', 'image_url',
    'github_url', 'demo_url', 'technologies', 'category',
    'status', 'display_order', 'is_featured', 'team_members',
    'started_at', 'completed_at',
  ];
  
  for (const field of fields) {
    if (field in input && input[field as keyof typeof input] !== undefined) {
      updateData[field] = input[field as keyof typeof input];
    }
  }
  
  if (Object.keys(updateData).length === 0) return existing;
  
  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error('Failed to update project: ' + error.message);
  }
  
  if (data) {
    await logAudit({
      adminUserId: updatedBy,
      action: 'updated',
      entityType: 'project',
      entityId: data.id,
      details: { title: data.title, fields_updated: Object.keys(input) },
      ipAddress,
      userAgent,
    });
  }
  
  return data;
}

export async function deleteProject(
  id: string,
  deletedBy: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<boolean> {
  const existing = await getProjectById(id);
  if (!existing) return false;
  
  await logAudit({
    adminUserId: deletedBy,
    action: 'deleted',
    entityType: 'project',
    entityId: id,
    details: { title: existing.title },
    ipAddress,
    userAgent,
  });
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  return !error;
}