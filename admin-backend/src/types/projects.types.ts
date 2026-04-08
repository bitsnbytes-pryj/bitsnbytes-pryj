import { z } from 'zod';
import { TimestampFields, EntityStatus } from './common.types.js';

// Project database type
export interface Project extends TimestampFields {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  image_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  technologies: string[];
  category: string | null;
  status: EntityStatus;
  display_order: number;
  is_featured: boolean;
  started_at: Date | null;
  completed_at: Date | null;
  team_members: string[]; // Array of team member IDs
  created_by: string | null;
}

// Create project validation
export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  short_description: z.string().max(300).optional(),
  image_url: z.string().url().optional(),
  demo_url: z.string().url().optional(),
  github_url: z.string().url().optional(),
  technologies: z.array(z.string()).default([]),
  category: z.string().max(100).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  display_order: z.number().int().default(0),
  is_featured: z.boolean().default(false),
  started_at: z.string().or(z.date()).optional(),
  completed_at: z.string().or(z.date()).optional(),
  team_members: z.array(z.string()).default([]),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// Update project validation
export const updateProjectSchema = createProjectSchema.partial();

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// List projects query
export const listProjectsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  category: z.string().optional(),
  is_featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'display_order', 'title', 'completed_at']).default('display_order'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;