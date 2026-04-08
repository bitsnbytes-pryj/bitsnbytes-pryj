import { Request, Response, NextFunction } from 'express';
import { createContact } from '../services/contact.service.js';
import { successResponse } from '../utils/response.js';
import { contactSchema } from '../types/index.js';

export async function submitContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = contactSchema.parse(req.body);
    
    const meta = {
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.get('user-agent') || 'unknown',
    };

    const result = await createContact(input, meta);

    res.status(201).json(successResponse({
      id: result.id,
      message: 'Your message has been sent successfully. We\'ll get back to you soon!',
    }));
  } catch (error) {
    next(error);
  }
}