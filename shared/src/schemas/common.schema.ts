/**
 * Common Zod schemas for validation across the platform
 */

import { z } from 'zod';

// =============================================
// Pagination Schemas
// =============================================

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// =============================================
// Status Schemas
// =============================================

export const entityStatusSchema = z.enum(['draft', 'published', 'archived']);
export const eventStatusSchema = z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']);
export const projectStatusSchema = z.enum(['planning', 'active', 'completed', 'on-hold']);

// =============================================
// Social Links Schema
// =============================================

export const socialLinksSchema = z.object({
  email: z.string().email().optional().nullable(),
  linkedin_url: z.string().url().optional().nullable().or(z.literal('')),
  github_url: z.string().url().optional().nullable().or(z.literal('')),
  twitter_url: z.string().url().optional().nullable().or(z.literal('')),
  website_url: z.string().url().optional().nullable().or(z.literal('')),
  portfolio_url: z.string().url().optional().nullable().or(z.literal('')),
});

// =============================================
// Timestamp Schema (for API responses)
// =============================================

export const timestampFieldsSchema = z.object({
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

// =============================================
// API Response Schemas
// =============================================

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
  });

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.record(z.unknown()).optional(),
});

// =============================================
// ID Param Schema
// =============================================

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});