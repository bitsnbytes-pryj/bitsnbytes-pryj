/**
 * Team Member Zod schemas for validation
 */

import { z } from 'zod';
import { paginationQuerySchema, socialLinksSchema } from './common.schema.js';

// =============================================
// Department & Badge Schemas
// =============================================

export const departmentSchema = z.enum([
  'Leadership',
  'Engineering',
  'Design',
  'Community',
  'Content',
  'Operations'
]);

export const teamMemberBadgeSchema = z.enum([
  'Prayagraj Lead',
  'Prayagraj Core',
  'Original Foundation',
  'Community Builder'
]);

// =============================================
// Base Team Member Schema
// =============================================

export const teamMemberBaseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1).max(150).optional(),
  role: z.string().min(1, 'Role is required').max(100),
  
  // Basic Info
  bio: z.string().max(1000).optional().nullable(),
  image_url: z.string().url().optional().nullable().or(z.literal('')),
  phone: z.string().max(20).optional().nullable(),
  
  // Organization
  department: departmentSchema.optional().nullable(),
  badge: teamMemberBadgeSchema.optional().nullable(),
  
  // Education
  year_of_study: z.number().int().min(1).max(10).optional().nullable(),
  college: z.string().max(200).optional().nullable(),
  
  // Skills & Expertise
  skills: z.array(z.string().max(50)).default([]),
  superpowers: z.array(z.string().max(200)).default([]),
  
  // Achievements & Contributions (for frontend display)
  achievements: z.array(z.string().max(500)).default([]),
  talkToMeWhen: z.array(z.string().max(500)).default([]),
  
  // Status
  is_active: z.boolean().default(true),
  isPrayagrajChapter: z.boolean().default(false),
  
  // Display
  display_order: z.number().int().default(0),
  
  // Timeline
  joined_at: z.string().or(z.date()).optional().nullable(),
  left_at: z.string().or(z.date()).optional().nullable(),
  
  // Social Links
  ...socialLinksSchema.shape,
});

// =============================================
// Create Team Member Schema
// =============================================

export const createTeamMemberSchema = teamMemberBaseSchema;

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;

// =============================================
// Update Team Member Schema
// =============================================

export const updateTeamMemberSchema = teamMemberBaseSchema.partial();

export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;

// =============================================
// List Team Members Query Schema
// =============================================

export const listTeamMembersQuerySchema = paginationQuerySchema.extend({
  is_active: z.coerce.boolean().optional(),
  department: departmentSchema.optional(),
  badge: teamMemberBadgeSchema.optional(),
  isPrayagrajChapter: z.coerce.boolean().optional(),
  search: z.string().max(200).optional(),
  sort_by: z.enum(['created_at', 'display_order', 'name', 'joined_at']).default('display_order'),
});

export type ListTeamMembersQueryInput = z.infer<typeof listTeamMembersQuerySchema>;