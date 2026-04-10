import { Router, Request, Response } from 'express';
import { supabase } from '../../db/index.js';
import { authMiddleware } from '../../middleware/auth.js';
import { logAudit } from '../../services/audit.service.js';

const router = Router();
router.use(authMiddleware);

// List team members
router.get('/', async (req: Request, res: Response) => {
  try {
    const { isPrayagraj, department, limit = '50', offset = '0' } = req.query;
    
    let query = supabase
      .from('team_members')
      .select('*', { count: 'exact' })
      .order('display_order', { ascending: true });
    
    if (isPrayagraj === 'true') query = query.eq('is_prayagraj_chapter', true);
    if (isPrayagraj === 'false') query = query.eq('is_prayagraj_chapter', false);
    if (department) query = query.eq('department', department as string);
    
    query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    return res.json({ success: true, data, total: count });
  } catch (error) {
    console.error('List team error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch team members' });
  }
});

// Get single team member
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Team member not found' });
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Get team member error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch team member' });
  }
});

// Create team member
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('team_members')
      .insert(req.body)
      .select()
      .single();
    
    if (error) throw error;
    
    await logAudit({
      adminUserId: userId,
      action: 'create',
      entityType: 'team_member',
      entityId: data.id,
      details: { name: data.name, role: data.role },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Create team member error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create team member' });
  }
});

// Update team member
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('team_members')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Team member not found' });
    
    await logAudit({
      adminUserId: userId,
      action: 'update',
      entityType: 'team_member',
      entityId: data.id,
      details: { name: data.name, changes: Object.keys(req.body) },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Update team member error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update team member' });
  }
});

// Delete team member
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data, error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Team member not found' });
    
    await logAudit({
      adminUserId: userId,
      action: 'delete',
      entityType: 'team_member',
      entityId: data.id,
      details: { name: data.name },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    console.error('Delete team member error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete team member' });
  }
});

export default router;