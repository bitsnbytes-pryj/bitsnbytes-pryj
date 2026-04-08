import { supabase } from '../config/supabase.js';
import { TeamMember } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all active team members
export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    logger.error('Failed to fetch team members', { error: error.message });
    throw new AppError('Failed to fetch team members', 500);
  }

  // Remove email field for public API
  return (data as TeamMember[]).map((member) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, ...publicMember } = member;
    return publicMember as TeamMember;
  });
}