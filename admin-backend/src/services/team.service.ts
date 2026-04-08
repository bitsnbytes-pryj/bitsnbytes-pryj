import { supabase } from '../db/index.js';
import { TeamMember, CreateTeamMemberInput, UpdateTeamMemberInput, ListTeamMembersQuery } from '../types/team.types.js';
import { PaginatedResult } from '../types/common.types.js';
import { logAudit } from './audit.service.js';

function parseTeamInput(input: CreateTeamMemberInput | UpdateTeamMemberInput) {
  return {
    ...input,
    joined_at: input.joined_at ? new Date(input.joined_at) : undefined,
  };
}

export async function createTeamMember(
  input: CreateTeamMemberInput,
  createdBy: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<TeamMember> {
  const parsed = parseTeamInput(input);
  
  const { data, error } = await supabase
    .from('team_members')
    .insert({
      name: parsed.name,
      email: parsed.email || null,
      phone: parsed.phone || null,
      role: parsed.role,
      department: parsed.department || null,
      bio: parsed.bio || null,
      image_url: parsed.image_url || null,
      linkedin_url: parsed.linkedin_url || null,
      github_url: parsed.github_url || null,
      twitter_url: parsed.twitter_url || null,
      portfolio_url: parsed.portfolio_url || null,
      year_of_study: parsed.year_of_study || null,
      college: parsed.college || null,
      skills: parsed.skills || [],
      is_active: parsed.is_active ?? true,
      display_order: parsed.display_order || 0,
      joined_at: parsed.joined_at || null,
    })
    .select()
    .single();
  
  if (error || !data) {
    throw new Error('Failed to create team member: ' + (error?.message || 'Unknown error'));
  }
  
  await logAudit({
    adminUserId: createdBy,
    action: 'created',
    entityType: 'team_member',
    entityId: data.id,
    details: { name: data.name, role: data.role },
    ipAddress,
    userAgent,
  });
  
  return data;
}

export async function listTeamMembers(params: ListTeamMembersQuery): Promise<PaginatedResult<TeamMember>> {
  const { page, limit, is_active, department, search, sort_by, sort_order } = params;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('team_members')
    .select('*', { count: 'exact' });
  
  if (is_active !== undefined) {
    query = query.eq('is_active', is_active);
  }
  
  if (department) {
    query = query.eq('department', department);
  }
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,role.ilike.%${search}%,department.ilike.%${search}%`);
  }
  
  const { count } = await query;
  const totalItems = count || 0;
  
  const validSortColumns = ['created_at', 'display_order', 'name', 'joined_at'];
  const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'display_order';
  
  const { data: items, error } = await query
    .order(sortColumn, { ascending: sort_order === 'asc' })
    .range(offset, offset + limit - 1);
  
  if (error) {
    throw new Error('Failed to fetch team members: ' + error.message);
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

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error('Failed to fetch team member: ' + error.message);
  }
  
  return data;
}

export async function updateTeamMember(
  id: string,
  input: UpdateTeamMemberInput,
  updatedBy: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<TeamMember | null> {
  const existing = await getTeamMemberById(id);
  if (!existing) return null;
  
  const parsed = parseTeamInput(input);
  
  const updateData: Record<string, any> = {};
  const fields = [
    'name', 'email', 'phone', 'role', 'department', 'bio', 'image_url',
    'linkedin_url', 'github_url', 'twitter_url', 'portfolio_url',
    'year_of_study', 'college', 'skills', 'is_active', 'display_order', 'joined_at', 'left_at',
  ];
  
  for (const field of fields) {
    if (field in parsed && parsed[field as keyof typeof parsed] !== undefined) {
      updateData[field] = parsed[field as keyof typeof parsed];
    }
  }
  
  if (Object.keys(updateData).length === 0) return existing;
  
  const { data, error } = await supabase
    .from('team_members')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error('Failed to update team member: ' + error.message);
  }
  
  if (data) {
    await logAudit({
      adminUserId: updatedBy,
      action: 'updated',
      entityType: 'team_member',
      entityId: data.id,
      details: { name: data.name, fields_updated: Object.keys(input) },
      ipAddress,
      userAgent,
    });
  }
  
  return data;
}

export async function deleteTeamMember(
  id: string,
  deletedBy: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<boolean> {
  const existing = await getTeamMemberById(id);
  if (!existing) return false;
  
  await logAudit({
    adminUserId: deletedBy,
    action: 'deleted',
    entityType: 'team_member',
    entityId: id,
    details: { name: existing.name },
    ipAddress,
    userAgent,
  });
  
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);
  
  return !error;
}