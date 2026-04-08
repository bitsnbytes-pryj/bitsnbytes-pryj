import { supabase } from '../config/supabase.js';
import { EventRegisterInput, RequestMeta, Event } from '../types/index.js';
import { sendFormEmails } from './email.service.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all events
export async function getEvents(options?: {
  status?: string;
  limit?: number;
}): Promise<Event[]> {
  let query = supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true });

  if (options?.status) {
    query = query.eq('status', options.status);
  } else {
    // By default, show upcoming and ongoing events first
    query = query.in('status', ['upcoming', 'ongoing']);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    logger.error('Failed to fetch events', { error: error.message });
    throw new AppError('Failed to fetch events', 500);
  }

  return data as Event[];
}

// Get single event by ID or slug
export async function getEvent(idOrSlug: string): Promise<Event | null> {
  // Check if it's a UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

  const field = isUuid ? 'id' : 'slug';
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq(field, idOrSlug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    logger.error('Failed to fetch event', { error: error.message });
    throw new AppError('Failed to fetch event', 500);
  }

  return data as Event;
}

// Create event registration
export async function createEventRegistration(
  input: EventRegisterInput,
  meta: RequestMeta
): Promise<{ id: string }> {
  // Check if event exists
  const event = await getEvent(input.event_id);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if already registered
  const { data: existing } = await supabase
    .from('event_registrations')
    .select('id')
    .eq('event_id', input.event_id)
    .eq('email', input.email)
    .single();

  if (existing) {
    throw new AppError('You have already registered for this event', 400);
  }

  // Insert registration
  const { data, error } = await supabase
    .from('event_registrations')
    .insert({
      event_id: input.event_id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      organization: input.organization,
      special_requirements: input.special_requirements,
      ip_address: meta.ip_address,
      user_agent: meta.user_agent,
    })
    .select('id')
    .single();

  if (error) {
    logger.error('Failed to save event registration', { error: error.message });
    throw new Error('Failed to save event registration');
  }

  // Send emails (non-blocking)
  sendFormEmails(
    'Event Registration',
    {
      Event: event.title,
      Name: input.name,
      Email: input.email,
      Phone: input.phone || 'Not provided',
      Organization: input.organization,
      'Special Requirements': input.special_requirements,
    },
    input.email,
    input.name
  ).catch((err) => {
    logger.error('Email sending failed for event registration', { error: err });
  });

  return { id: data.id };
}