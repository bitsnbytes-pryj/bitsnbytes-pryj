/**
 * Event entity types for the Bits&Bytes platform
 */

import { TimestampFields, EventStatus } from './common.types.js';

// =============================================
// Event Entity
// =============================================

/**
 * Full Event entity as stored in the database
 */
export interface Event extends TimestampFields {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  content: string | null;
  
  // Date & Time
  event_date: string;
  event_time: string | null;
  end_date: string | null;
  end_time: string | null;
  registration_deadline: string | null;
  
  // Location (supports hybrid events)
  venue: string | null;
  address: string | null;
  location_url: string | null;
  is_online: boolean;
  online_url: string | null;
  
  // Registration
  registration_required: boolean;
  registration_link: string | null;
  capacity: number | null;
  registered_count: number;
  
  // Pricing
  is_free: boolean;
  price: number | null;
  
  // Media & Categorization
  image_url: string | null;
  tags: string[];
  status: EventStatus;
  
  // Display
  is_featured: boolean;
  display_order: number;
  
  // Audit
  created_by: string | null;
}

// =============================================
// Public Event (for frontend display)
// =============================================

/**
 * Event data safe for public display
 * Excludes sensitive internal fields
 */
export interface PublicEvent extends Omit<Event, 'created_by'> {
  // All fields from Event except created_by
}

// =============================================
// Event Registration
// =============================================

/**
 * Event registration entity
 */
export interface EventRegistration extends TimestampFields {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  special_requirements: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
  registered_at: string;
}

// =============================================
// Query Types
// =============================================

/**
 * Query parameters for listing events
 */
export interface ListEventsQuery {
  page?: number;
  limit?: number;
  status?: EventStatus;
  is_featured?: boolean;
  is_online?: boolean;
  is_free?: boolean;
  search?: string;
  tags?: string[];
  sort_by?: 'event_date' | 'created_at' | 'display_order' | 'title';
  sort_order?: 'asc' | 'desc';
}