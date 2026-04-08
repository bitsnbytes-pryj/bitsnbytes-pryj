import { Request, Response, NextFunction } from 'express';
import { getEvents, getEvent, createEventRegistration } from '../services/event.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { eventRegisterSchema } from '../types/index.js';

export async function listEvents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    
    const events = await getEvents({ status, limit });
    res.json(successResponse(events));
  } catch (error) {
    next(error);
  }
}

export async function getEventById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const event = await getEvent(id);

    if (!event) {
      res.status(404).json(errorResponse('Event not found'));
      return;
    }

    res.json(successResponse(event));
  } catch (error) {
    next(error);
  }
}

export async function registerForEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = eventRegisterSchema.parse(req.body);
    
    const meta = {
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.get('user-agent') || 'unknown',
    };

    const result = await createEventRegistration(input, meta);

    res.status(201).json(successResponse({
      id: result.id,
      message: 'You have successfully registered for the event!',
    }));
  } catch (error) {
    next(error);
  }
}