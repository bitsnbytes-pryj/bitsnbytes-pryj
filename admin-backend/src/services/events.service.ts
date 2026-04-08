import { supabase } from '../db/index.js';
import { Event, CreateEventInput, UpdateEventInput, ListEventsQuery } from '../types/events.types.js';
import { PaginatedResult } from '../types/common.types.js';
import { logAudit } from './audit.service.js';

// Helper to parse dates
function parseEventInput(input: CreateEventInput | UpdateEventInput) {
  return {
    ...input,
    event_date: input.event_date ? new Date(input.event_date) : undefined,
    end_date: input.end_date ? new Date(input.end_date) : undefined,
    registration_deadline: input.registration_deadline ? new Date(input.registration_deadline) : undefined,
  };
}

// Create event
export async function createEvent(
  input: CreateEventInput,
  createdBy: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<Event> {
  const parsed = parseEventInput(input);
  
  const { data, error } = await supabase
    .from('events')
    .insert({
      title: parsed.title,
      description: parsed.description || null,
      short_description: parsed.short_description || null,
      venue: parsed.venue || null,
      address: parsed.address || null,
      event_date: parsed.event_date,
      end_date: parsed.end_date || null,
      registration_deadline: parsed.registration_deadline || null,
      capacity: parsed.capacity || null,
      image_url: parsed.image_url || null,
      registration_link: parsed.registration_link || null,
      is_free: parsed.is_free ?? true,
      price: parsed.price || null,
      tags: parsed.tags || [],
      status: parsed.status || 'draft',
      display_order: parsed.display_order || 0,
      is_featured: parsed.is_featured ?? false,
      created_by: createdBy,
    })
    .select()
    .single();
  
  if (error || !data) {
    throw new Error('Failed to create event: ' + (error?.message || 'Unknown error'));
  }
  
  await logAudit({
    adminUserId: createdBy,
    action: 'created',
    entityType: 'event',
    entityId: data.id,
    details: { title: data.title },
    ipAddress,
    userAgent,
  });
  
  return data;
}

// List events with pagination
export async function listEvents(params: ListEventsQuery): Promise<PaginatedResult<Event>> {
  const { page, limit, status, is_featured, search, sort_by, sort_order } = params;
  const offset = (page - 1) * limit;
  
  // Build query
  let query = supabase
    .from('events')
    .select('*', { count: 'exact' });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (is_featured !== undefined) {
    query = query.eq('is_featured', is_featured);
  }
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,venue.ilike.%${search}%`);
  }
  
  // Get total count
  const { count } = await query;
  const totalItems = count || 0;
  
  // Apply sorting and pagination
  const validSortColumns = ['event_date', 'created_at', 'display_order', 'title'];
  const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'display_order';
  
  const { data: items, error } = await query
    .order(sortColumn, { ascending: sort_order === 'asc' })
    .range(offset, offset + limit - 1);
  
  if (error) {
    throw new Error('Failed to fetch events: ' + error.message);
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

// Get event by ID
export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error('Failed to fetch event: ' + error.message);
  }
  
  return data;
}

// Update event
export async function updateEvent(
  id: string,
  input: UpdateEventInput,
  updatedBy: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<Event | null> {
  const existing = await getEventById(id);
  if (!existing) return null;
  
  const parsed = parseEventInput(input);
  
  // Build update object
  const updateData: Record<string, any> = {};
  const fields = [
    'title', 'description', 'short_description', 'venue', 'address',
    'event_date', 'end_date', 'registration_deadline', 'capacity',
    'image_url', 'registration_link', 'is_free', 'price', 'tags',
    'status', 'display_order', 'is_featured',
  ];
  
  for (const field of fields) {
    if (field in parsed && parsed[field as keyof typeof parsed] !== undefined) {
      updateData[field] = parsed[field as keyof typeof parsed];
    }
  }
  
  if (Object.keys(updateData).length === 0) return existing;
  
  const { data, error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error('Failed to update event: ' + error.message);
  }
  
  if (data) {
    await logAudit({
      adminUserId: updatedBy,
      action: 'updated',
      entityType: 'event',
      entityId: data.id,
      details: { title: data.title, fields_updated: Object.keys(input) },
      ipAddress,
      userAgent,
    });
  }
  
  return data;
}

// Delete event
export async function deleteEvent(
  id: string,
  deletedBy: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<boolean> {
  const existing = await getEventById(id);
  if (!existing) return false;
  
  await logAudit({
    adminUserId: deletedBy,
    action: 'deleted',
    entityType: 'event',
    entityId: id,
    details: { title: existing.title },
    ipAddress,
    userAgent,
  });
  
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  
  return !error;
}