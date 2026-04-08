import { Request, Response } from 'express';
import { getDashboardStats } from '../services/dashboard.service.js';
import { successResponses, errorResponses } from '../utils/response.js';

export async function getDashboardStatsController(_req: Request, res: Response): Promise<void> {
  try {
    const stats = await getDashboardStats();
    successResponses.ok(res, stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    errorResponses.internalError(res, 'Failed to get dashboard stats');
  }
}

export async function healthCheckController(_req: Request, res: Response): Promise<void> {
  res.status(200).json({ success: true, data: { status: 'healthy', timestamp: new Date().toISOString() } });
}