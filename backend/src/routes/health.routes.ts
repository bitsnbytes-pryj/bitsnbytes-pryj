import { Router, Request, Response } from 'express';
import { successResponse } from '../utils/response.js';
import { checkSupabaseConnection } from '../config/supabase.js';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const dbConnected = await checkSupabaseConnection();
  
  res.json(successResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbConnected ? 'connected' : 'disconnected',
  }));
});

export default router;