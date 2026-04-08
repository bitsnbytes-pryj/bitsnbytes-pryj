import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { validationErrorResponse } from '../utils/response.js';

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(validationErrorResponse(error.errors.map(e => ({
          path: e.path,
          message: e.message,
        }))));
        return;
      }
      next(error);
    }
  };
}

export function validateQuery(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(validationErrorResponse(error.errors.map(e => ({
          path: e.path,
          message: e.message,
        }))));
        return;
      }
      next(error);
    }
  };
}
