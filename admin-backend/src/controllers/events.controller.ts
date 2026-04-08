import { Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  createEvent,
  listEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../services/events.service.js';
import { successResponses, errorResponses } from '../utils/response.js';
import { createEventSchema, updateEventSchema, listEventsQuerySchema } from '../types/events.types.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

// Helper functions
function getClientIp(req: Request): string | null {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() 
    || req.socket?.remoteAddress 
    || null;
}

function getUserAgent(req: Request): string | null {
  return req.headers['user-agent'] || null;
}

// Create event
export async function createEventController(req: Request, res: Response): Promise<void> {
  try {
    const input = createEventSchema.parse(req.body);
    const authReq = req as AuthenticatedRequest;
    
    const event = await createEvent(
      input,
      authReq.user.id,
      getClientIp(req),
      getUserAgent(req)
    );
    
    successResponses.created(res, event);
  } catch (error) {
    if (error instanceof ZodError) {
      errorResponses.validationError(res, {
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }
    
    console.error('Create event error:', error);
    errorResponses.internalError(res, 'Failed to create event');
  }
}

// List events
export async function listEventsController(req: Request, res: Response): Promise<void> {
  try {
    const query = listEventsQuerySchema.parse(req.query);
    const result = await listEvents(query);
    successResponses.paginated(
      res,
      result.items,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.totalItems
    );
  } catch (error) {
    if (error instanceof ZodError) {
      errorResponses.validationError(res, {
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }
    
    console.error('List events error:', error);
    errorResponses.internalError(res, 'Failed to list events');
  }
}

// Get event by ID
export async function getEventController(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const event = await getEventById(id);
    
    if (!event) {
      errorResponses.notFound(res, 'Event not found');
      return;
    }
    
    successResponses.ok(res, event);
  } catch (error) {
    console.error('Get event error:', error);
    errorResponses.internalError(res, 'Failed to get event');
  }
}

// Update event
export async function updateEventController(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const input = updateEventSchema.parse(req.body);
    const authReq = req as AuthenticatedRequest;
    
    const event = await updateEvent(
      id,
      input,
      authReq.user.id,
      getClientIp(req),
      getUserAgent(req)
    );
    
    if (!event) {
      errorResponses.notFound(res, 'Event not found');
      return;
    }
    
    successResponses.ok(res, event);
  } catch (error) {
    if (error instanceof ZodError) {
      errorResponses.validationError(res, {
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }
    
    console.error('Update event error:', error);
    errorResponses.internalError(res, 'Failed to update event');
  }
}

// Delete event
export async function deleteEventController(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;
    
    const deleted = await deleteEvent(
      id,
      authReq.user.id,
      getClientIp(req),
      getUserAgent(req)
    );
    
    if (!deleted) {
      errorResponses.notFound(res, 'Event not found');
      return;
    }
    
    successResponses.noContent(res);
  } catch (error) {
    console.error('Delete event error:', error);
    errorResponses.internalError(res, 'Failed to delete event');
  }
}