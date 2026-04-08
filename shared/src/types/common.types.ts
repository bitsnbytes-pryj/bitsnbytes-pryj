/**
 * Common types used across all packages in the Bits&Bytes platform
 */

// =============================================
// API Response Types
// =============================================

/**
 * Standard success response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
}

/**
 * Standard error response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: Record<string, unknown>;
}

/**
 * Union type for API responses that can be success or error
 */
export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

/**
 * Type guard for checking if a response is successful
 */
export function isApiResponse<T>(response: ApiResult<T>): response is ApiResponse<T> {
  return response.success === true;
}

/**
 * Type guard for checking if a response is an error
 */
export function isApiError<T>(response: ApiResult<T>): response is ApiErrorResponse {
  return response.success === false;
}

// =============================================
// Pagination Types
// =============================================

/**
 * Query parameters for paginated endpoints
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Pagination metadata included in responses
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// =============================================
// Timestamp & Audit Fields
// =============================================

/**
 * Common timestamp fields present on all entities
 */
export interface TimestampFields {
  created_at: string;
  updated_at: string;
}

/**
 * Soft delete support
 */
export interface SoftDeletable {
  deleted_at: string | null;
}

// =============================================
// Entity Status Types
// =============================================

/**
 * Common status for entities that can be published
 */
export type EntityStatus = 'draft' | 'published' | 'archived';

/**
 * Event-specific status
 */
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

/**
 * Project-specific status
 */
export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on-hold';

// =============================================
// Request Metadata
// =============================================

/**
 * Metadata extracted from incoming requests
 */
export interface RequestMeta {
  ip_address: string;
  user_agent: string;
}

// =============================================
// Common Query Filters
// =============================================

/**
 * Filter by status
 */
export interface StatusFilter {
  status?: EntityStatus;
}

/**
 * Filter by active state
 */
export interface ActiveFilter {
  is_active?: boolean;
}

/**
 * Filter by featured state
 */
export interface FeaturedFilter {
  is_featured?: boolean;
}

// =============================================
// Social Links Type
// =============================================

/**
 * Common social media links structure
 */
export interface SocialLinks {
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  twitter_url?: string | null;
  website_url?: string | null;
  portfolio_url?: string | null;
}