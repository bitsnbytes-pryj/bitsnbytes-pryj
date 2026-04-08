/**
 * Project Zod schemas for validation
 */

import { z } from 'zod';
import { projectStatusSchema, paginationQuerySchema } from './common.schema.js';

// =============================================
// Base Project Schema
// =============================================

export const projectBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(250).optional(),
  description: z.string().max(5000).optional().nullable(),
  short_description: z.string().max(300).optional().nullable(),
  content: z.string().max(50000).optional().nullable(),
  
  // Media
  image_url: z.string().url().optional().nullable().or(z.literal('')),
  
  // Links
  github_url: z.string().url().optional().nullable().or(z.literal('')),
  live_url: z.string().url().optional().nullable().or(z.literal('')),
  demo_url: z.string().url().optional().nullable().or(z.literal('')),
  
  // Categorization
  technologies: z.array(z.string().max(50)).default([]),
  category: z.string().max(100).optional().nullable(),
  status: projectStatusSchema.default('planning'),
  
  // Team
  team_members: z.array(z.string().uuid()).default([]),
  
  // Display
  is_featured: z.boolean().default(false),
  display_order: z.number().int().default(0),
  
  // Timeline
  started_at: z.string().or(z.date()).optional().nullable(),
  completed_at: z.string().or(z.date()).optional().nullable(),
});

// =============================================
// Create Project Schema
// =============================================

export const createProjectSchema = projectBaseSchema;

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// =============================================
// Update Project Schema
// =============================================

export const updateProjectSchema = projectBaseSchema.partial();

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// =============================================
// List Projects Query Schema
// =============================================

export const listProjectsQuerySchema = paginationQuerySchema.extend({
  status: projectStatusSchema.optional(),
  category: z.string().max(100).optional(),
  is_featured: z.coerce.boolean().optional(),
  technology: z.string().max(50).optional(),
  search: z.string().max(200).optional(),
  sort_by: z.enum(['created_at', 'display_order', 'title', 'completed_at']).default('display_order'),
});

export type ListProjectsQueryInput = z.infer<typeof listProjectsQuerySchema>;