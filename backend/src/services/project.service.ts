import { supabase } from '../config/supabase.js';
import { Project } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all projects
export async function getProjects(options?: {
  status?: string;
  limit?: number;
}): Promise<Project[]> {
  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    logger.error('Failed to fetch projects', { error: error.message });
    throw new AppError('Failed to fetch projects', 500);
  }

  return data as Project[];
}

// Get single project by ID or slug
export async function getProject(idOrSlug: string): Promise<Project | null> {
  // Check if it's a UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

  const field = isUuid ? 'id' : 'slug';
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq(field, idOrSlug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    logger.error('Failed to fetch project', { error: error.message });
    throw new AppError('Failed to fetch project', 500);
  }

  return data as Project;
}