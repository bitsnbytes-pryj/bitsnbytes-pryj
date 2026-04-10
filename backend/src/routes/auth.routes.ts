import { Router, Request, Response } from 'express';
import { supabase } from '../db/index.js';
import { comparePassword } from '../auth/hash.js';
import { generateToken, getTokenExpiration } from '../auth/jwt.js';
import { authMiddleware } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';

const router = Router();

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }
    
    // Find user
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (error || !user) {
      await logAudit({
        adminUserId: null,
        action: 'login_failed',
        entityType: 'admin_user',
        entityId: null,
        details: { email, reason: 'user_not_found' },
        ipAddress: req.ip || null,
        userAgent: req.headers['user-agent'] || null,
      });
      
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }
    
    // Verify password
    const isValid = await comparePassword(password, user.password_hash);
    
    if (!isValid) {
      await logAudit({
        adminUserId: user.id,
        action: 'login_failed',
        entityType: 'admin_user',
        entityId: user.id,
        details: { reason: 'invalid_password' },
        ipAddress: req.ip || null,
        userAgent: req.headers['user-agent'] || null,
      });
      
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }
    
    if (!user.is_active) {
      await logAudit({
        adminUserId: user.id,
        action: 'login_failed',
        entityType: 'admin_user',
        entityId: user.id,
        details: { reason: 'account_inactive' },
        ipAddress: req.ip || null,
        userAgent: req.headers['user-agent'] || null,
      });
      
      return res.status(401).json({
        success: false,
        error: 'Account is inactive',
      });
    }
    
    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);
    
    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    
    // Log successful login
    await logAudit({
      adminUserId: user.id,
      action: 'login_success',
      entityType: 'admin_user',
      entityId: user.id,
      details: null,
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
        expiresAt: getTokenExpiration(token),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, is_active, last_login_at, created_at')
      .eq('id', userId)
      .single();
    
    if (error || !user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    
    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Logout (client-side token removal, but log it)
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    await logAudit({
      adminUserId: (req as any).user.id,
      action: 'logout',
      entityType: 'admin_user',
      entityId: (req as any).user.id,
      details: null,
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });
    
    return res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;