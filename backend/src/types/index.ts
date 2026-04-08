import { z } from 'zod';

// =============================================
// API Response Types
// =============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, unknown>;
}

// =============================================
// Zod Schemas for Form Submissions
// =============================================

// Contact Form Schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(255).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;

// Join Application Schema
export const joinSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(50).optional(),
  interests: z.array(z.string()).max(10).optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  why_join: z.string().max(2000).optional(),
  how_heard: z.string().max(100).optional(),
});

export type JoinInput = z.infer<typeof joinSchema>;

// Event Registration Schema
export const eventRegisterSchema = z.object({
  event_id: z.string().uuid('Invalid event ID'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(50).optional(),
  organization: z.string().max(255).optional(),
  special_requirements: z.string().max(1000).optional(),
});

export type EventRegisterInput = z.infer<typeof eventRegisterSchema>;

// Role Application Schema
export const roleApplySchema = z.object({
  role_id: z.string().uuid('Invalid role ID'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(50).optional(),
  portfolio_url: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  resume_url: z.string().url('Invalid resume URL').optional().or(z.literal('')),
  cover_letter: z.string().max(5000).optional(),
  linkedin_url: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  availability: z.string().max(100).optional(),
});

export type RoleApplyInput = z.infer<typeof roleApplySchema>;

// Feedback Schema
export const feedbackSchema = z.object({
  name: z.string().max(255).optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  feedback_type: z.enum(['general', 'event', 'website', 'suggestion', 'complaint', 'appreciation']).default('general'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  rating: z.number().int().min(1).max(5).optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

// =============================================
// Database Entity Types
// =============================================

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  image_url: string | null;
  event_date: string;
  event_time: string | null;
  end_time: string | null;
  location: string | null;
  location_url: string | null;
  is_online: boolean;
  online_url: string | null;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[];
  is_featured: boolean;
  registration_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  time_commitment: string | null;
  is_active: boolean;
  department: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  github_url: string | null;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  technologies: string[];
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// =============================================
// Public API Types (Safe for frontend)
// =============================================

export interface PublicEvent extends Omit<Event, 'id'> {
  id: string;
}

export interface PublicRole extends Omit<Role, 'id'> {
  id: string;
}

export interface PublicTeamMember extends Omit<TeamMember, 'id' | 'email'> {
  id: string;
}

export interface PublicProject extends Omit<Project, 'id'> {
  id: string;
}

// =============================================
// Request Types (with metadata)
// =============================================

export interface RequestMeta {
  ip_address: string;
  user_agent: string;
}

// =============================================
// Pagination Types
// =============================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}