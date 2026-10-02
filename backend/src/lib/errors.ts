import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code = 'APP_ERROR',
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found', code: 'NOT_FOUND' });
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }

  console.error('Unhandled request error', error);
  res.status(500).json({ error: 'An unexpected error occurred', code: 'INTERNAL_ERROR' });
};

export const asyncHandler = <T extends Request>(
  handler: (req: T, res: Response, next: NextFunction) => Promise<unknown>,
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handler(req as T, res, next)).catch(next);
};
