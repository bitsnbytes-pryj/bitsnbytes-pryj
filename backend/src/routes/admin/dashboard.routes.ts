import { Router, Request, Response } from 'express';
import { supabase } from '../../db/index.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// Get dashboard statistics
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    // Get counts from all tables in parallel
    const [
      eventsResult,
      teamResult,
      projectsResult,
      rolesResult,
      contactsResult,
      joinResult,
      eventRegResult,
      roleAppResult,
      feedbackResult,
    ] = await Promise.all([
      supabase.from('events').select('id, status', { count: 'exact' }),
      supabase.from('team_members').select('id, is_active', { count: 'exact' }),
      supabase.from('projects').select('id, status, is_featured', { count: 'exact' }),
      supabase.from('roles').select('id, is_active', { count: 'exact' }),
      supabase.from('contacts').select('id, status', { count: 'exact' }),
      supabase.from('join_applications').select('id, status', { count: 'exact' }),
      supabase.from('event_registrations').select('id, status', { count: 'exact' }),
      supabase.from('role_applications').select('id, status', { count: 'exact' }),
      supabase.from('feedback').select('id, status', { count: 'exact' }),
    ]);
    
    const stats = {
      events: {
        total: eventsResult.count || 0,
        upcoming: eventsResult.data?.filter(e => e.status === 'upcoming').length || 0,
        ongoing: eventsResult.data?.filter(e => e.status === 'ongoing').length || 0,
        completed: eventsResult.data?.filter(e => e.status === 'completed').length || 0,
      },
      team: {
        total: teamResult.count || 0,
        active: teamResult.data?.filter(t => t.is_active).length || 0,
      },
      projects: {
        total: projectsResult.count || 0,
        featured: projectsResult.data?.filter(p => p.is_featured).length || 0,
        active: projectsResult.data?.filter(p => p.status === 'active').length || 0,
      },
      roles: {
        total: rolesResult.count || 0,
        active: rolesResult.data?.filter(r => r.is_active).length || 0,
      },
      submissions: {
        contacts: {
          total: contactsResult.count || 0,
          new: contactsResult.data?.filter(c => c.status === 'new').length || 0,
        },
        joinApplications: {
          total: joinResult.count || 0,
          new: joinResult.data?.filter(j => j.status === 'new').length || 0,
        },
        eventRegistrations: {
          total: eventRegResult.count || 0,
          confirmed: eventRegResult.data?.filter(e => e.status === 'confirmed').length || 0,
        },
        roleApplications: {
          total: roleAppResult.count || 0,
          new: roleAppResult.data?.filter(r => r.status === 'new').length || 0,
        },
        feedback: {
          total: feedbackResult.count || 0,
          new: feedbackResult.data?.filter(f => f.status === 'new').length || 0,
        },
      },
    };
    
    return res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch dashboard stats' });
  }
});

// Get recent activity
router.get('/activity', async (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query;
    
    // Get recent submissions from all tables
    const [recentContacts, recentJoin, recentEventReg, recentFeedback] = await Promise.all([
      supabase
        .from('contacts')
        .select('id, name, email, subject, created_at')
        .order('created_at', { ascending: false })
        .limit(parseInt(limit as string)),
      supabase
        .from('join_applications')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(parseInt(limit as string)),
      supabase
        .from('event_registrations')
        .select('id, name, email, event:events(title), created_at')
        .order('created_at', { ascending: false })
        .limit(parseInt(limit as string)),
      supabase
        .from('feedback')
        .select('id, name, email, feedback_type, created_at')
        .order('created_at', { ascending: false })
        .limit(parseInt(limit as string)),
    ]);
    
    // Combine and sort by date
    const activities = [
      ...(recentContacts.data || []).map(c => ({ ...c, type: 'contact' })),
      ...(recentJoin.data || []).map(j => ({ ...j, type: 'join_application' })),
      ...(recentEventReg.data || []).map(e => ({ ...e, type: 'event_registration' })),
      ...(recentFeedback.data || []).map(f => ({ ...f, type: 'feedback' })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, parseInt(limit as string));
    
    return res.json({ success: true, data: activities });
  } catch (error) {
    console.error('Get recent activity error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch recent activity' });
  }
});

export default router;