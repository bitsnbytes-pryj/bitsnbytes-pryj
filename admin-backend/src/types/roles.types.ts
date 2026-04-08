import { z } from 'zod';
import { TimestampFields, EntityStatus } from './common.types.js';

// Role database type
export interface Role extends TimestampFields {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  location: string | null;
  type: 'full-time' | 'part-time' | 'internship' | 'volunteer';
  requirements: string[];
  responsibilities: string[];
  skills_required: string[];
  benefits: string[];
  application_deadline: Date | null;
  vacancies: number | null;
  applications_count: number;
  status: EntityStatus;
  display_order: number;
  is_featured: boolean;
  created_by: string | null;
}

// Create role validation
export const createRoleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  department: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  type: z.enum(['full-time', 'part-time', 'internship', 'volunteer']).default('volunteer'),
  requirements: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  skills_required: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  application_deadline: z.string().or(z.date()).optional(),
  vacancies: z.number().int().positive().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  display_order: z.number().int().default(0),
  is_featured: z.boolean().default(false),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

// Update role validation
export const updateRoleSchema = createRoleSchema.partial();

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

// List roles query
export const listRolesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  type: z.enum(['full-time', 'part-time', 'internship', 'volunteer']).optional(),
  is_featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'display_order', 'title', 'application_deadline']).default('display_order'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

export type ListRolesQuery = z.infer<typeof listRolesQuerySchema>;