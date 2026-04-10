import { Router, Request, Response } from 'express';
import { supabase } from '../../db/index.js';
import { authMiddleware } from '../../middleware/auth.js';
import { logAudit } from '../../services/audit.service.js';

const router = Router();
router.use(authMiddleware);

// ============ CONTACTS ============

router.get('/contacts', async (req: Request, res: Response) => {
  try {
    const { status, limit = '50', offset = '0' } = req.query;
    
    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (status) query = query.eq('status', status as string);
    query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    return res.json({ success: true, data, total: count });
  } catch (error) {
    console.error('List contacts error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch contacts' });
  }
});

router.put('/contacts/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('contacts')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Contact not found' });
    
    await logAudit({
      adminUserId: userId,
      action: 'update',
      entityType: 'contact',
      entityId: data.id,
      details: { name: data.name, changes: Object.keys(req.body) },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Update contact error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update contact' });
  }
});

// ============ JOIN APPLICATIONS ============

router.get('/join', async (req: Request, res: Response) => {
  try {
    const { status, limit = '50', offset = '0' } = req.query;
    
    let query = supabase
      .from('join_applications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (status) query = query.eq('status', status as string);
    query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    return res.json({ success: true, data, total: count });
  } catch (error) {
    console.error('List join applications error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch join applications' });
  }
});

router.put('/join/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('join_applications')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Application not found' });
    
    await logAudit({
      adminUserId: userId,
      action: 'update',
      entityType: 'join_application',
      entityId: data.id,
      details: { name: data.name, changes: Object.keys(req.body) },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Update join application error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update application' });
  }
});

// ============ EVENT REGISTRATIONS ============

router.get('/event-registrations', async (req: Request, res: Response) => {
  try {
    const { eventId, status, limit = '50', offset = '0' } = req.query;
    
    let query = supabase
      .from('event_registrations')
      .select('*, event:events(id, title, event_date)', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (eventId) query = query.eq('event_id', eventId as string);
    if (status) query = query.eq('status', status as string);
    query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    return res.json({ success: true, data, total: count });
  } catch (error) {
    console.error('List event registrations error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch registrations' });
  }
});

router.put('/event-registrations/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('event_registrations')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Registration not found' });
    
    await logAudit({
      adminUserId: userId,
      action: 'update',
      entityType: 'event_registration',
      entityId: data.id,
      details: { changes: Object.keys(req.body) },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Update registration error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update registration' });
  }
});

// ============ ROLE APPLICATIONS ============

router.get('/role-applications', async (req: Request, res: Response) => {
  try {
    const { roleId, status, limit = '50', offset = '0' } = req.query;
    
    let query = supabase
      .from('role_applications')
      .select('*, role:roles(id, title, department)', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (roleId) query = query.eq('role_id', roleId as string);
    if (status) query = query.eq('status', status as string);
    query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    return res.json({ success: true, data, total: count });
  } catch (error) {
    console.error('List role applications error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch applications' });
  }
});

router.put('/role-applications/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('role_applications')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Application not found' });
    
    await logAudit({
      adminUserId: userId,
      action: 'update',
      entityType: 'role_application',
      entityId: data.id,
      details: { changes: Object.keys(req.body) },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Update role application error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update application' });
  }
});

// ============ FEEDBACK ============

router.get('/feedback', async (req: Request, res: Response) => {
  try {
    const { type, status, limit = '50', offset = '0' } = req.query;
    
    let query = supabase
      .from('feedback')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (type) query = query.eq('feedback_type', type as string);
    if (status) query = query.eq('status', status as string);
    query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    return res.json({ success: true, data, total: count });
  } catch (error) {
    console.error('List feedback error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
});

router.put('/feedback/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('feedback')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Feedback not found' });
    
    await logAudit({
      adminUserId: userId,
      action: 'update',
      entityType: 'feedback',
      entityId: data.id,
      details: { changes: Object.keys(req.body) },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Update feedback error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update feedback' });
  }
});

export default router;