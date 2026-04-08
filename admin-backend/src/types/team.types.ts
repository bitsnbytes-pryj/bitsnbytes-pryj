import { z } from 'zod';
import { TimestampFields } from './common.types.js';

// Team member database type
export interface TeamMember extends TimestampFields {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  department: string | null;
  bio: string | null;
  image_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  portfolio_url: string | null;
  year_of_study: number | null;
  college: string | null;
  skills: string[];
  is_active: boolean;
  display_order: number;
  joined_at: Date | null;
  left_at: Date | null;
}

// Create team member validation
export const createTeamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  role: z.string().min(1, 'Role is required').max(100),
  department: z.string().max(100).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  linkedin_url: z.string().url().optional().nullable(),
  github_url: z.string().url().optional().nullable(),
  twitter_url: z.string().url().optional().nullable(),
  portfolio_url: z.string().url().optional().nullable(),
  year_of_study: z.number().int().min(1).max(10).optional().nullable(),
  college: z.string().max(200).optional().nullable(),
  skills: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  display_order: z.number().int().default(0),
  joined_at: z.string().or(z.date()).optional().nullable(),
});

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;

// Update team member validation
export const updateTeamMemberSchema = createTeamMemberSchema.partial();

export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;

// List team members query
export const listTeamMembersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  is_active: z.coerce.boolean().optional(),
  department: z.string().optional(),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'display_order', 'name', 'joined_at']).default('display_order'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

export type ListTeamMembersQuery = z.infer<typeof listTeamMembersQuerySchema>;