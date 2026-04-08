/**
 * Role entity types for the Bits&Bytes platform
 */

import { TimestampFields, EntityStatus } from './common.types.js';

// =============================================
// Role Types
// =============================================

/**
 * Employment/engagement type for roles
 */
export type RoleType = 'full-time' | 'part-time' | 'internship' | 'volunteer';

// =============================================
// Role Entity
// =============================================

/**
 * Full Role entity as stored in the database
 */
export interface Role extends TimestampFields {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  
  // Organization
  department: string | null;
  location: string | null;
  type: RoleType;
  
  // Requirements
  requirements: string[];
  responsibilities: string[];
  skills_required: string[];
  
  // Benefits
  benefits: string[];
  time_commitment: string | null;
  
  // Application
  application_deadline: string | null;
  vacancies: number | null;
  applications_count: number;
  
  // Status
  status: EntityStatus;
  is_active: boolean;
  
  // Display
  is_featured: boolean;
  display_order: number;
  
  // Audit
  created_by: string | null;
}

// =============================================
// Public Role (for frontend display)
// =============================================

/**
 * Role data safe for public display
 * Excludes sensitive internal fields
 */
export interface PublicRole extends Omit<Role, 'created_by'> {
  // All fields from Role except created_by
}

// =============================================
// Role Application
// =============================================

/**
 * Role application entity
 */
export interface RoleApplication extends TimestampFields {
  id: string;
  role_id: string;
  name: string;
  email: string;
  phone: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  cover_letter: string | null;
  linkedin_url: string | null;
  availability: string | null;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  applied_at: string;
}

// =============================================
// Query Types
// =============================================

/**
 * Query parameters for listing roles
 */
export interface ListRolesQuery {
  page?: number;
  limit?: number;
  status?: EntityStatus;
  type?: RoleType;
  department?: string;
  is_featured?: boolean;
  is_active?: boolean;
  search?: string;
  sort_by?: 'created_at' | 'display_order' | 'title' | 'application_deadline';
  sort_order?: 'asc' | 'desc';
}