import { Response } from 'express';
import { ApiResponse, ApiErrorResponse } from '../types/common.types.js';

// Send a success response
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  res.status(statusCode).json(response);
}

// Send an error response
export function sendError(
  res: Response,
  message: string,
  statusCode: number = 400,
  details?: Record<string, unknown>
): void {
  const response: ApiErrorResponse = {
    success: false,
    error: message,
    ...(details && { details }),
  };
  res.status(statusCode).json(response);
}

// Common error responses
export const errorResponses = {
  badRequest: (res: Response, message: string = 'Bad request', details?: Record<string, unknown>) =>
    sendError(res, message, 400, details),
  
  unauthorized: (res: Response, message: string = 'Unauthorized') =>
    sendError(res, message, 401),
  
  forbidden: (res: Response, message: string = 'Forbidden') =>
    sendError(res, message, 403),
  
  notFound: (res: Response, message: string = 'Resource not found') =>
    sendError(res, message, 404),
  
  conflict: (res: Response, message: string = 'Conflict') =>
    sendError(res, message, 409),
  
  validationError: (res: Response, details: Record<string, unknown>) =>
    sendError(res, 'Validation failed', 422, details),
  
  internalError: (res: Response, message: string = 'Internal server error') =>
    sendError(res, message, 500),
  
  tooManyRequests: (res: Response, message: string = 'Too many requests, please try again later') =>
    sendError(res, message, 429),
};

// Common success responses
export const successResponses = {
  ok: <T>(res: Response, data: T) => sendSuccess(res, data, 200),
  
  created: <T>(res: Response, data: T) => sendSuccess(res, data, 201),
  
  noContent: (res: Response) => res.status(204).send(),
  
  paginated: <T>(
    res: Response,
    items: T[],
    page: number,
    limit: number,
    totalItems: number
  ) => {
    const totalPages = Math.ceil(totalItems / limit);
    sendSuccess(res, {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  },
};