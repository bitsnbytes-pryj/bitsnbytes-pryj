import { Request, Response, NextFunction } from 'express';
import { createFeedback } from '../services/feedback.service.js';
import { successResponse } from '../utils/response.js';
import { feedbackSchema } from '../types/index.js';

export async function submitFeedback(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = feedbackSchema.parse(req.body);
    
    const meta = {
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.get('user-agent') || 'unknown',
    };

    const result = await createFeedback(input, meta);

    res.status(201).json(successResponse({
      id: result.id,
      message: 'Thank you for your feedback!',
    }));
  } catch (error) {
    next(error);
  }
}