/**
 * Shared constants for the Bits&Bytes platform
 */

// =============================================
// Entity Statuses
// =============================================

export const ENTITY_STATUSES = ['draft', 'published', 'archived'] as const;
export const EVENT_STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled'] as const;
export const PROJECT_STATUSES = ['planning', 'active', 'completed', 'on-hold'] as const;

// =============================================
// Role Types
// =============================================

export const ROLE_TYPES = ['full-time', 'part-time', 'internship', 'volunteer'] as const;

// =============================================
// Departments
// =============================================

export const DEPARTMENTS = [
  'Leadership',
  'Engineering', 
  'Design',
  'Community',
  'Content',
  'Operations'
] as const;

// =============================================
// Team Member Badges
// =============================================

export const TEAM_MEMBER_BADGES = [
  'Prayagraj Lead',
  'Prayagraj Core',
  'Original Foundation',
  'Community Builder'
] as const;

// =============================================
// Application Statuses
// =============================================

export const APPLICATION_STATUSES = ['pending', 'reviewing', 'accepted', 'rejected'] as const;
export const REGISTRATION_STATUSES = ['pending', 'confirmed', 'cancelled', 'attended'] as const;

// =============================================
// Feedback Types
// =============================================

export const FEEDBACK_TYPES = [
  'general',
  'event',
  'website',
  'suggestion',
  'complaint',
  'appreciation'
] as const;

// =============================================
// Experience Levels
// =============================================

export const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

// =============================================
// Pagination Defaults
// =============================================

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// =============================================
// Rate Limiting
// =============================================

export const RATE_LIMITS = {
  // API routes
  API_DEFAULT: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 60_000, // 1 minute
  },
  // Chat assistant
  ASSISTANT: {
    MAX_REQUESTS: 10,
    WINDOW_MS: 60_000, // 1 minute
  },
  // Form submissions
  FORM_SUBMISSION: {
    MAX_REQUESTS: 5,
    WINDOW_MS: 60_000, // 1 minute
  },
} as const;