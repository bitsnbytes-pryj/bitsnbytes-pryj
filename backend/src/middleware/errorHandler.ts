import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { errorResponse, validationErrorResponse } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json(validationErrorResponse(err.errors.map(e => ({
      path: e.path,
      message: e.message,
    }))));
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.message, err.details));
    return;
  }

  // Handle generic errors
  res.status(500).json(errorResponse(
    process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  ));
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(errorResponse(`Route ${req.method} ${req.path} not found`));
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}