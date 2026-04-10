import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

// Create Supabase client with service role key for admin operations
export const supabase: SupabaseClient = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Helper to check connection
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('events').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}

// Connect to database
export async function connectDb(): Promise<void> {
  try {
    const isConnected = await checkSupabaseConnection();
    if (isConnected) {
      console.log('Supabase database connected successfully');
    } else {
      throw new Error('Failed to connect to Supabase');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  return checkSupabaseConnection();
}

// Export supabase as default
export default supabase;