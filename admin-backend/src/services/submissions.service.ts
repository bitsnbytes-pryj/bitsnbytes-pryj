import { supabase } from '../db/index.js';
import { PaginatedResult } from '../types/common.types.js';

// Types for submissions
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  source: string | null;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface JoinSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  college: string | null;
  year_of_study: string | null;
  interests: string[];
  skills: string[];
  experience: string | null;
  motivation: string | null;
  status: 'new' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string | null;
  college: string | null;
  status: 'registered' | 'attended' | 'cancelled';
  created_at: string;
}

export interface ListSubmissionsQuery {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  sort_by: string;
  sort_order: 'asc' | 'desc';
}

// List contact submissions
export async function listContactSubmissions(params: ListSubmissionsQuery): Promise<PaginatedResult<ContactSubmission>> {
  const { page, limit, status, search, sort_by, sort_order } = params;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('contacts')
    .select('*', { count: 'exact' });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
  }
  
  const { count } = await query;
  const totalItems = count || 0;
  
  const { data: items, error } = await query
    .order(sort_by, { ascending: sort_order === 'asc' })
    .range(offset, offset + limit - 1);
  
  if (error) {
    throw new Error('Failed to fetch contact submissions: ' + error.message);
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

// List join submissions
export async function listJoinSubmissions(params: ListSubmissionsQuery): Promise<PaginatedResult<JoinSubmission>> {
  const { page, limit, status, search, sort_by, sort_order } = params;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('join_applications')
    .select('*', { count: 'exact' });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,college.ilike.%${search}%`);
  }
  
  const { count } = await query;
  const totalItems = count || 0;
  
  const { data: items, error } = await query
    .order(sort_by, { ascending: sort_order === 'asc' })
    .range(offset, offset + limit - 1);
  
  if (error) {
    throw new Error('Failed to fetch join submissions: ' + error.message);
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

// List event registrations
export async function listEventRegistrations(
  eventId: string,
  params: ListSubmissionsQuery
): Promise<PaginatedResult<EventRegistration>> {
  const { page, limit, status, search, sort_by, sort_order } = params;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('event_registrations')
    .select('*', { count: 'exact' })
    .eq('event_id', eventId);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }
  
  const { count } = await query;
  const totalItems = count || 0;
  
  const { data: items, error } = await query
    .order(sort_by, { ascending: sort_order === 'asc' })
    .range(offset, offset + limit - 1);
  
  if (error) {
    throw new Error('Failed to fetch event registrations: ' + error.message);
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

// Update contact submission status
export async function updateContactStatus(
  id: string,
  status: ContactSubmission['status']
): Promise<ContactSubmission | null> {
  const { data, error } = await supabase
    .from('contacts')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error('Failed to update contact status: ' + error.message);
  }
  
  return data;
}

// Update join submission status
export async function updateJoinStatus(
  id: string,
  status: JoinSubmission['status']
): Promise<JoinSubmission | null> {
  const { data, error } = await supabase
    .from('join_applications')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error('Failed to update join status: ' + error.message);
  }
  
  return data;
}