import { Request, Response, NextFunction } from 'express';
import { createJoinApplication } from '../services/join.service.js';
import { successResponse } from '../utils/response.js';
import { joinSchema } from '../types/index.js';

export async function submitJoin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = joinSchema.parse(req.body);
    
    const meta = {
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.get('user-agent') || 'unknown',
    };

    const result = await createJoinApplication(input, meta);

    res.status(201).json(successResponse({
      id: result.id,
      message: 'Your application has been submitted successfully. We\'ll review it and get back to you soon!',
    }));
  } catch (error) {
    next(error);
  }
}