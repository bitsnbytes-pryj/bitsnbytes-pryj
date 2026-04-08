/**
 * Role Zod schemas for validation
 */

import { z } from 'zod';
import { entityStatusSchema, paginationQuerySchema } from './common.schema.js';

// =============================================
// Role Type Schema
// =============================================

export const roleTypeSchema = z.enum(['full-time', 'part-time', 'internship', 'volunteer']);

// =============================================
// Base Role Schema
// =============================================

export const roleBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(250).optional(),
  description: z.string().max(5000).optional().nullable(),
  
  // Organization
  department: z.string().max(100).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  type: roleTypeSchema.default('volunteer'),
  
  // Requirements
  requirements: z.array(z.string().max(500)).default([]),
  responsibilities: z.array(z.string().max(500)).default([]),
  skills_required: z.array(z.string().max(50)).default([]),
  
  // Benefits
  benefits: z.array(z.string().max(500)).default([]),
  time_commitment: z.string().max(100).optional().nullable(),
  
  // Application
  application_deadline: z.string().or(z.date()).optional().nullable(),
  vacancies: z.number().int().positive().optional().nullable(),
  
  // Status
  status: entityStatusSchema.default('draft'),
  is_active: z.boolean().default(true),
  
  // Display
  is_featured: z.boolean().default(false),
  display_order: z.number().int().default(0),
});

// =============================================
// Create Role Schema
// =============================================

export const createRoleSchema = roleBaseSchema;

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

// =============================================
// Update Role Schema
// =============================================

export const updateRoleSchema = roleBaseSchema.partial();

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

// =============================================
// Role Application Schema
// =============================================

export const roleApplySchema = z.object({
  role_id: z.string().uuid('Invalid role ID'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(50).optional().nullable(),
  portfolio_url: z.string().url('Invalid portfolio URL').optional().nullable().or(z.literal('')),
  resume_url: z.string().url('Invalid resume URL').optional().nullable().or(z.literal('')),
  cover_letter: z.string().max(5000).optional().nullable(),
  linkedin_url: z.string().url('Invalid LinkedIn URL').optional().nullable().or(z.literal('')),
  availability: z.string().max(100).optional().nullable(),
});

export type RoleApplyInput = z.infer<typeof roleApplySchema>;

// =============================================
// List Roles Query Schema
// =============================================

export const listRolesQuerySchema = paginationQuerySchema.extend({
  status: entityStatusSchema.optional(),
  type: roleTypeSchema.optional(),
  department: z.string().max(100).optional(),
  is_featured: z.coerce.boolean().optional(),
  is_active: z.coerce.boolean().optional(),
  search: z.string().max(200).optional(),
  sort_by: z.enum(['created_at', 'display_order', 'title', 'application_deadline']).default('display_order'),
});

export type ListRolesQueryInput = z.infer<typeof listRolesQuerySchema>;