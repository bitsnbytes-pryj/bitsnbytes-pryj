/**
 * Form validation schemas for public submissions
 */

import { z } from 'zod';

// =============================================
// Contact Form Schema
// =============================================

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(255).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  source: z.string().max(50).default('form').optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

// =============================================
// Join Application Schema
// =============================================

export const joinSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(50).optional().nullable(),
  school: z.string().max(255).optional().nullable(),
  interests: z.array(z.string().max(100)).max(10).optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']).optional().nullable(),
  why_join: z.string().max(2000).optional().nullable(),
  how_heard: z.string().max(100).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
});

export type JoinInput = z.infer<typeof joinSchema>;

// =============================================
// Feedback Schema
// =============================================

export const feedbackSchema = z.object({
  name: z.string().max(255).optional().nullable(),
  email: z.string().email('Invalid email address').optional().nullable().or(z.literal('')),
  feedback_type: z.enum(['general', 'event', 'website', 'suggestion', 'complaint', 'appreciation']).default('general'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  source: z.string().max(50).default('form').optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

// =============================================
// Sponsor Inquiry Schema
// =============================================

export const sponsorInquirySchema = z.object({
  company_name: z.string().min(2, 'Company name is required').max(255),
  contact_name: z.string().min(2, 'Contact name is required').max(255),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(50).optional().nullable(),
  sponsor_type: z.enum(['title', 'gold', 'silver', 'bronze', 'inkind']).optional().nullable(),
  budget_range: z.string().max(100).optional().nullable(),
  goals: z.string().min(10, 'Please describe your sponsorship goals').max(2000),
  message: z.string().max(5000).optional().nullable(),
  source: z.string().max(50).default('form').optional(),
});

export type SponsorInquiryInput = z.infer<typeof sponsorInquirySchema>;