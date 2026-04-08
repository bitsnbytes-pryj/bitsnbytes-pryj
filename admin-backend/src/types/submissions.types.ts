import { z } from 'zod';
import { TimestampFields } from './common.types.js';

// Contact submission database type
export interface Contact extends TimestampFields {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  read_at: Date | null;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  notes: string | null;
}

// Join application database type
export interface JoinApplication extends TimestampFields {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  college: string;
  year_of_study: number | null;
  department: string | null;
  skills: string[];
  interests: string[];
  motivation: string | null;
  experience: string | null;
  referral_source: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'archived';
  reviewed_at: Date | null;
  reviewed_by: string | null;
  notes: string | null;
}

// Event registration database type
export interface EventRegistration extends TimestampFields {
  id: string;
  event_id: string;
  event_title: string;
  name: string;
  email: string;
  phone: string | null;
  college: string | null;
  year_of_study: number | null;
  notes: string | null;
  status: 'registered' | 'attended' | 'cancelled' | 'no_show';
  registered_at: Date;
  attended_at: Date | null;
}

// Role application database type
export interface RoleApplication extends TimestampFields {
  id: string;
  role_id: string;
  role_title: string;
  name: string;
  email: string;
  phone: string | null;
  college: string | null;
  year_of_study: number | null;
  resume_url: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  cover_letter: string | null;
  relevant_experience: string | null;
  availability: string | null;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'accepted' | 'rejected' | 'archived';
  reviewed_at: Date | null;
  reviewed_by: string | null;
  notes: string | null;
}

// Feedback database type
export interface Feedback extends TimestampFields {
  id: string;
  name: string | null;
  email: string | null;
  type: 'general' | 'event' | 'website' | 'suggestion' | 'complaint' | 'appreciation';
  rating: number | null;
  event_id: string | null;
  event_title: string | null;
  subject: string | null;
  message: string;
  is_anonymous: boolean;
  status: 'new' | 'acknowledged' | 'actioned' | 'archived';
  notes: string | null;
}

// List query schemas
export const listContactsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['new', 'in_progress', 'resolved', 'archived']).optional(),
  is_read: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'read_at', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export const listJoinApplicationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['pending', 'reviewing', 'accepted', 'rejected', 'archived']).optional(),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'reviewed_at', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export const listEventRegistrationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  event_id: z.string().optional(),
  status: z.enum(['registered', 'attended', 'cancelled', 'no_show']).optional(),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'registered_at', 'name']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export const listRoleApplicationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  role_id: z.string().optional(),
  status: z.enum(['pending', 'reviewing', 'shortlisted', 'interviewed', 'accepted', 'rejected', 'archived']).optional(),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'reviewed_at', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export const listFeedbackQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  type: z.enum(['general', 'event', 'website', 'suggestion', 'complaint', 'appreciation']).optional(),
  status: z.enum(['new', 'acknowledged', 'actioned', 'archived']).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'rating', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export type ListContactsQuery = z.infer<typeof listContactsQuerySchema>;
export type ListJoinApplicationsQuery = z.infer<typeof listJoinApplicationsQuerySchema>;
export type ListEventRegistrationsQuery = z.infer<typeof listEventRegistrationsQuerySchema>;
export type ListRoleApplicationsQuery = z.infer<typeof listRoleApplicationsQuerySchema>;
export type ListFeedbackQuery = z.infer<typeof listFeedbackQuerySchema>;