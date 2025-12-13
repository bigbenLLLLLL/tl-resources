import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';
import { ZodError } from 'zod';
import { HttpError } from '../errors/HttpError';
import { sendFailure } from '../utils/http';

function isPrismaLike(e: unknown): e is { code?: string; meta?: unknown } {
  return typeof e === 'object' && e !== null && 'code' in (e as object);
}

export function notFoundHandler(req: Request, res: Response) {
  return sendFailure(res, 404, 'NOT_FOUND', 'Not Found');
}

// Express error handler (4 args) — centralizes error -> HTTP mapping
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  // If headers already sent, delegate to the default Express error handler
  if (res.headersSent) {
    return next(err as any);
  }

  try {
    logger.error({ err, path: req.path, method: req.method }, 'Unhandled error');
  } catch (error) {
    // fallback
    console.error(error);
  }

  // HttpError (thrown by services)
  if (err instanceof HttpError) {
    return sendFailure(res, err.status || 500, err.code || 'ERROR', err.message || 'Error');
  }

  // Zod validation errors -> 422 Unprocessable Entity
  if (err instanceof ZodError) {
    // send a validation error with code and message
    return sendFailure(res, 422, 'VALIDATION_ERROR', 'Validation Error');
  }

  // Prisma unique constraint or known DB errors
  // Prisma errors often expose a `code` like 'P2002' for unique constraint
  if (isPrismaLike(err)) {
    if (err.code === 'P2002') {
      return sendFailure(res, 409, 'UNIQUE_CONSTRAINT', 'Conflict');
    }
  }

  // Fallback: internal server error
  return sendFailure(res, 500, 'INTERNAL_ERROR', 'Internal Server Error');
}
