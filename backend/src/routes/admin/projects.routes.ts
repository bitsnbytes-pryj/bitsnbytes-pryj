import { Router, Request, Response } from 'express';
import { supabase } from '../../db/index.js';
import { authMiddleware } from '../../middleware/auth.js';
import { logAudit } from '../../services/audit.service.js';

const router = Router();
router.use(authMiddleware);

// List projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, featured, limit = '50', offset = '0' } = req.query;
    
    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (category) query = query.eq('category', category as string);
    if (featured === 'true') query = query.eq('is_featured', true);
    
    query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    return res.json({ success: true, data, total: count });
  } catch (error) {
    console.error('List projects error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

// Get single project
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Project not found' });
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch project' });
  }
});

// Create project
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('projects')
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
      entityType: 'project',
      entityId: data.id,
      details: { title: data.title },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('projects')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Project not found' });
    
    await logAudit({
      adminUserId: userId,
      action: 'update',
      entityType: 'project',
      entityId: data.id,
      details: { title: data.title, changes: Object.keys(req.body) },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Project not found' });
    
    await logAudit({
      adminUserId: userId,
      action: 'delete',
      entityType: 'project',
      entityId: data.id,
      details: { title: data.title },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete project' });
  }
});

export default router;