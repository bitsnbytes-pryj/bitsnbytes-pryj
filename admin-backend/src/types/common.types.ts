import { Request } from 'express';

// API Response types
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: Record<string, unknown>;
}

// Pagination types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Timestamp fields present on all entities
export interface TimestampFields {
  created_at: Date;
  updated_at: Date;
}

// Soft delete support
export interface SoftDeletable {
  deleted_at: Date | null;
}

// Request with authenticated user
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

// Audit log entry
export interface AuditLogEntry {
  id: string;
  admin_user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
}

// Base status type
export type EntityStatus = 'draft' | 'published' | 'archived';

// Common query filters
export interface StatusFilter {
  status?: EntityStatus;
}

export interface ActiveFilter {
  is_active?: boolean;
}