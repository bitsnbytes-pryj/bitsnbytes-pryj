import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './index.js';

// Create Supabase client with service role key for backend operations
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