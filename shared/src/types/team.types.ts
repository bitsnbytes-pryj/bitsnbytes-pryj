/**
 * Team Member entity types for the Bits&Bytes platform
 */

import { TimestampFields, SocialLinks } from './common.types.js';

// =============================================
// Team Member Badge Types
// =============================================

/**
 * Badge types for team member recognition
 */
export type TeamMemberBadge = 
  | 'Prayagraj Lead' 
  | 'Prayagraj Core' 
  | 'Original Foundation' 
  | 'Community Builder';

/**
 * Department types for team organization
 */
export type Department = 
  | 'Leadership' 
  | 'Engineering' 
  | 'Design' 
  | 'Community' 
  | 'Content' 
  | 'Operations';

// =============================================
// Team Member Entity
// =============================================

/**
 * Full Team Member entity as stored in the database
 * Combines admin fields with frontend display fields
 */
export interface TeamMember extends TimestampFields, SocialLinks {
  id: string;
  name: string;
  role: string;
  slug: string;
  
  // Basic Info
  bio: string | null;
  image_url: string | null;
  phone: string | null;
  
  // Organization
  department: Department | null;
  badge: TeamMemberBadge | null;
  
  // Education
  year_of_study: number | null;
  college: string | null;
  
  // Skills & Expertise
  skills: string[];
  superpowers: string[];
  
  // Achievements & Contributions (for frontend display)
  achievements: string[];
  talkToMeWhen: string[];
  
  // Status
  is_active: boolean;
  isPrayagrajChapter: boolean;
  
  // Display
  display_order: number;
  
  // Timeline
  joined_at: string | null;
  left_at: string | null;
}

// =============================================
// Public Team Member (for frontend display)
// =============================================

/**
 * Team member data safe for public display
 * Excludes sensitive fields like email, phone
 */
export interface PublicTeamMember extends Omit<TeamMember, 'email' | 'phone'> {
  // All fields from TeamMember except email and phone
}

// =============================================
// Simplified Team Member (for cards/components)
// =============================================

/**
 * Simplified team member for card components
 * Matches the frontend's TeamMember interface from team-data.ts
 */
export interface TeamMemberCard {
  name: string;
  role: string;
  badge: TeamMemberBadge;
  superpowers: string[];
  achievements: string[];
  talkToMeWhen: string[];
  department: Department;
  isPrayagrajChapter?: boolean;
  image?: string;
}

// =============================================
// Query Types
// =============================================

/**
 * Query parameters for listing team members
 */
export interface ListTeamMembersQuery {
  page?: number;
  limit?: number;
  is_active?: boolean;
  department?: Department;
  badge?: TeamMemberBadge;
  isPrayagrajChapter?: boolean;
  search?: string;
  sort_by?: 'created_at' | 'display_order' | 'name' | 'joined_at';
  sort_order?: 'asc' | 'desc';
}