import { Router, Request, Response } from 'express';
import { supabase } from '../../db/index.js';
import { authMiddleware } from '../../middleware/auth.js';
import { logAudit } from '../../services/audit.service.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// List events
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, limit = '50', offset = '0' } = req.query;
    
    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('event_date', { ascending: false });
    
    if (status) query = query.eq('status', status as string);
    query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return res.json({ success: true, data, total: count });
  } catch (error) {
    console.error('List events error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
});

// Get single event
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Event not found' });
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Get event error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch event' });
  }
});

// Create event
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('events')
      .insert({ ...req.body, slug: req.body.slug || req.body.title.toLowerCase().replace(/\s+/g, '-') })
      .select()
      .single();
    
    if (error) throw error;
    
    await logAudit({
      adminUserId: userId,
      action: 'create',
      entityType: 'event',
      entityId: data.id,
      details: { title: data.title },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create event' });
  }
});

// Update event
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('events')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Event not found' });
    
    await logAudit({
      adminUserId: userId,
      action: 'update',
      entityType: 'event',
      entityId: data.id,
      details: { title: data.title, changes: Object.keys(req.body) },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Update event error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Event not found' });
    
    await logAudit({
      adminUserId: userId,
      action: 'delete',
      entityType: 'event',
      entityId: data.id,
      details: { title: data.title },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete event' });
  }
});

export default router;