import { Router, Request, Response } from 'express';
import { supabase } from '../../db/index.js';
import { authMiddleware } from '../../middleware/auth.js';
import { logAudit } from '../../services/audit.service.js';

const router = Router();
router.use(authMiddleware);

// List roles
router.get('/', async (req: Request, res: Response) => {
  try {
    const { isActive, limit = '50', offset = '0' } = req.query;
    
    let query = supabase
      .from('roles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (isActive === 'true') query = query.eq('is_active', true);
    
    query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    return res.json({ success: true, data, total: count });
  } catch (error) {
    console.error('List roles error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch roles' });
  }
});

// Get single role
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Role not found' });
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Get role error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch role' });
  }
});

// Create role
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('roles')
      .insert({ 
        ...req.body, 
        slug: req.body.slug || req.body.title.toLowerCase().replace(/\s+/g, '-') 
      })
      .select()
      .single();
    
    if (error) throw error;
    
    await logAudit({
      adminUserId: userId,
      action: 'create',
      entityType: 'role',
      entityId: data.id,
      details: { title: data.title },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Create role error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create role' });
  }
});

// Update role
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('roles')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Role not found' });
    
    await logAudit({
      adminUserId: userId,
      action: 'update',
      entityType: 'role',
      entityId: data.id,
      details: { title: data.title, changes: Object.keys(req.body) },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Update role error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update role' });
  }
});

// Delete role
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('roles')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Role not found' });
    
    await logAudit({
      adminUserId: userId,
      action: 'delete',
      entityType: 'role',
      entityId: data.id,
      details: { title: data.title },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({ success: true, message: 'Role deleted' });
  } catch (error) {
    console.error('Delete role error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete role' });
  }
});

export default router;