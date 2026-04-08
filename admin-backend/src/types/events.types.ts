import { z } from 'zod';
import { TimestampFields, EntityStatus } from './common.types.js';

// Event database type
export interface Event extends TimestampFields {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  venue: string | null;
  address: string | null;
  event_date: Date;
  end_date: Date | null;
  registration_deadline: Date | null;
  capacity: number | null;
  registered_count: number;
  image_url: string | null;
  registration_link: string | null;
  is_free: boolean;
  price: number | null;
  tags: string[];
  status: EntityStatus;
  display_order: number;
  is_featured: boolean;
  created_by: string | null;
}

// Create event validation
export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  short_description: z.string().max(300).optional(),
  venue: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  event_date: z.string().or(z.date()),
  end_date: z.string().or(z.date()).optional(),
  registration_deadline: z.string().or(z.date()).optional(),
  capacity: z.number().int().positive().optional(),
  image_url: z.string().url().optional(),
  registration_link: z.string().url().optional(),
  is_free: z.boolean().default(true),
  price: z.number().positive().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  display_order: z.number().int().default(0),
  is_featured: z.boolean().default(false),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// Update event validation
export const updateEventSchema = createEventSchema.partial();

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// List events query
export const listEventsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  is_featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sort_by: z.enum(['event_date', 'created_at', 'display_order', 'title']).default('display_order'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;