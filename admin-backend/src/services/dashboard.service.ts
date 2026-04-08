import { supabase } from '../db/index.js';

export interface DashboardStats {
  events: {
    total: number;
    upcoming: number;
    published: number;
  };
  team: {
    total: number;
    active: number;
  };
  projects: {
    total: number;
    published: number;
    featured: number;
  };
  roles: {
    total: number;
    open: number;
  };
  submissions: {
    contacts: {
      total: number;
      new: number;
    };
    joinApplications: {
      total: number;
      new: number;
    };
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  // Get event stats
  const { count: totalEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true });
  
  const { count: upcomingEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .gte('event_date', new Date().toISOString());
  
  const { count: publishedEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');
  
  // Get team stats
  const { count: totalTeam } = await supabase
    .from('team_members')
    .select('*', { count: 'exact', head: true });
  
  const { count: activeTeam } = await supabase
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
  
  // Get project stats
  const { count: totalProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });
  
  const { count: publishedProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');
  
  const { count: featuredProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('is_featured', true);
  
  // Get role stats
  const { count: totalRoles } = await supabase
    .from('roles')
    .select('*', { count: 'exact', head: true });
  
  const { count: openRoles } = await supabase
    .from('roles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');
  
  // Get submission stats
  const { count: totalContacts } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true });
  
  const { count: newContacts } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');
  
  const { count: totalJoinApps } = await supabase
    .from('join_applications')
    .select('*', { count: 'exact', head: true });
  
  const { count: newJoinApps } = await supabase
    .from('join_applications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');
  
  return {
    events: {
      total: totalEvents || 0,
      upcoming: upcomingEvents || 0,
      published: publishedEvents || 0,
    },
    team: {
      total: totalTeam || 0,
      active: activeTeam || 0,
    },
    projects: {
      total: totalProjects || 0,
      published: publishedProjects || 0,
      featured: featuredProjects || 0,
    },
    roles: {
      total: totalRoles || 0,
      open: openRoles || 0,
    },
    submissions: {
      contacts: {
        total: totalContacts || 0,
        new: newContacts || 0,
      },
      joinApplications: {
        total: totalJoinApps || 0,
        new: newJoinApps || 0,
      },
    },
  };
}

export interface RecentActivity {
  type: 'event' | 'project' | 'team' | 'role' | 'contact' | 'join';
  action: 'created' | 'updated' | 'deleted';
  title: string;
  timestamp: string;
}

export async function getRecentActivity(limit = 10): Promise<RecentActivity[]> {
  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (!auditLogs) return [];
  
  return auditLogs.map((log: any) => ({
    type: log.entity_type as RecentActivity['type'],
    action: log.action as RecentActivity['action'],
    title: (log.details as any)?.title || (log.details as any)?.name || log.entity_type,
    timestamp: log.created_at,
  }));
}