import type { Request, Response } from 'express';
import logger from '../utils/logger.js';
import { HttpError } from '../errors/HttpError';
import { sendFailure } from '../utils/http';

export function notFoundHandler(req: Request, res: Response) {
  return res.status(404).json({ error: 'Not Found' });
}

// Express error handler (4 args) — centralizes error -> HTTP mapping
export function errorHandler(err: unknown, req: Request, res: Response) {
  try {
    logger.error({ err, path: req.path, method: req.method }, 'Unhandled error');
  } catch (error) {
    // fallback
    console.error(error);
  }

  // HttpError (thrown by services)
  if (err instanceof HttpError) {
    return sendFailure(res, err.status, err.message, err.code, err.details);
  }

  // Prisma unique constraint or known DB errors
  // Prisma errors often expose a `code` like 'P2002' for unique constraint
  if (err && typeof err === 'object' && 'code' in err) {
    const e = err as any;
    if (e.code === 'P2002') {
      return sendFailure(res, 409, 'Conflict', 'UNIQUE_CONSTRAINT', e.meta ?? e);
    }
  }

  // Fallback: internal server error
  return sendFailure(res, 500, 'Internal Server Error');
}
