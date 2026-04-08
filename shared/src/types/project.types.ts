/**
 * Project entity types for the Bits&Bytes platform
 */

import { TimestampFields, ProjectStatus } from './common.types.js';

// =============================================
// Project Entity
// =============================================

/**
 * Full Project entity as stored in the database
 */
export interface Project extends TimestampFields {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  content: string | null;
  
  // Media
  image_url: string | null;
  
  // Links
  github_url: string | null;
  live_url: string | null;
  demo_url: string | null;
  
  // Categorization
  technologies: string[];
  category: string | null;
  status: ProjectStatus;
  
  // Team
  team_members: string[]; // Array of team member IDs
  
  // Display
  is_featured: boolean;
  display_order: number;
  
  // Timeline
  started_at: string | null;
  completed_at: string | null;
  
  // Audit
  created_by: string | null;
}

// =============================================
// Public Project (for frontend display)
// =============================================

/**
 * Project data safe for public display
 * Excludes sensitive internal fields
 */
export interface PublicProject extends Omit<Project, 'created_by'> {
  // All fields from Project except created_by
}

// =============================================
// Query Types
// =============================================

/**
 * Query parameters for listing projects
 */
export interface ListProjectsQuery {
  page?: number;
  limit?: number;
  status?: ProjectStatus;
  category?: string;
  is_featured?: boolean;
  technology?: string;
  search?: string;
  sort_by?: 'created_at' | 'display_order' | 'title' | 'completed_at';
  sort_order?: 'asc' | 'desc';
}