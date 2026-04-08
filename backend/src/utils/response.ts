import { ApiResponse } from '../types/index.js';

/**
 * Create a successful API response
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Create an error API response
 */
export function errorResponse(
  error: string,
  details?: Record<string, unknown>
): ApiResponse<never> {
  return {
    success: false,
    error,
    ...(details && { details }),
  };
}

/**
 * Create a validation error response from Zod errors
 */
export function validationErrorResponse(
  errors: Array<{ path: (string | number)[]; message: string }>
): ApiResponse<never> {
  const details: Record<string, string> = {};
  
  for (const error of errors) {
    const field = error.path.map(String).join('.');
    details[field] = error.message;
  }
  
  return {
    success: false,
    error: 'Validation failed',
    details,
  };
}
