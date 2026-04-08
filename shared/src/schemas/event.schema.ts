/**
 * Event Zod schemas for validation
 */

import { z } from 'zod';
import { eventStatusSchema, paginationQuerySchema } from './common.schema.js';

// =============================================
// Base Event Schema
// =============================================

export const eventBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(250).optional(),
  description: z.string().max(5000).optional().nullable(),
  short_description: z.string().max(300).optional().nullable(),
  content: z.string().max(50000).optional().nullable(),
  
  // Date & Time
  event_date: z.string().or(z.date()),
  event_time: z.string().max(20).optional().nullable(),
  end_date: z.string().or(z.date()).optional().nullable(),
  end_time: z.string().max(20).optional().nullable(),
  registration_deadline: z.string().or(z.date()).optional().nullable(),
  
  // Location (supports hybrid events)
  venue: z.string().max(200).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  location_url: z.string().url().optional().nullable().or(z.literal('')),
  is_online: z.boolean().default(false),
  online_url: z.string().url().optional().nullable().or(z.literal('')),
  
  // Registration
  registration_required: z.boolean().default(false),
  registration_link: z.string().url().optional().nullable().or(z.literal('')),
  capacity: z.number().int().positive().optional().nullable(),
  
  // Pricing
  is_free: z.boolean().default(true),
  price: z.number().positive().optional().nullable(),
  
  // Media & Categorization
  image_url: z.string().url().optional().nullable().or(z.literal('')),
  tags: z.array(z.string().max(50)).default([]),
  status: eventStatusSchema.default('upcoming'),
  
  // Display
  is_featured: z.boolean().default(false),
  display_order: z.number().int().default(0),
});

// =============================================
// Create Event Schema
// =============================================

export const createEventSchema = eventBaseSchema.extend({
  // All fields from base, no ID or timestamps
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// =============================================
// Update Event Schema
// =============================================

export const updateEventSchema = eventBaseSchema.partial();

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// =============================================
// Event Registration Schema
// =============================================

export const eventRegisterSchema = z.object({
  event_id: z.string().uuid('Invalid event ID'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(50).optional().nullable(),
  organization: z.string().max(255).optional().nullable(),
  special_requirements: z.string().max(1000).optional().nullable(),
});

export type EventRegisterInput = z.infer<typeof eventRegisterSchema>;

// =============================================
// List Events Query Schema
// =============================================

export const listEventsQuerySchema = paginationQuerySchema.extend({
  status: eventStatusSchema.optional(),
  is_featured: z.coerce.boolean().optional(),
  is_online: z.coerce.boolean().optional(),
  is_free: z.coerce.boolean().optional(),
  search: z.string().max(200).optional(),
  tags: z.array(z.string()).optional(),
  sort_by: z.enum(['event_date', 'created_at', 'display_order', 'title']).default('display_order'),
});

export type ListEventsQueryInput = z.infer<typeof listEventsQuerySchema>;