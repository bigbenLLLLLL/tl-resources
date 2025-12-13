import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';
import { ZodError } from 'zod';
import { HttpError } from '../errors/HttpError';
import { sendFailure } from '../utils/http';
import { ErrorCode, HttpStatus, ErrorMessage } from '../../../shared/src/types/api';

function isPrismaLike(e: unknown): e is { code?: string; meta?: unknown } {
  return typeof e === 'object' && e !== null && 'code' in (e as object);
}

export function notFoundHandler(req: Request, res: Response) {
  return sendFailure(res, {
    status: HttpStatus.NOT_FOUND,
    code: ErrorCode.NOT_FOUND,
    message: ErrorMessage.NOT_FOUND,
  });
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
    return sendFailure(res, {
      status: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      code: err.code || ErrorCode.ERROR,
      message: err.message || ErrorMessage.ERROR,
      details: (err as any).details,
    });
  }

  // Zod validation errors -> 422 Unprocessable Entity
  if (err instanceof ZodError) {
    // send a validation error with code, message and details (field issues)
    const details = err.flatten ? err.flatten() : { issues: err.issues };
    return sendFailure(res, {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      code: ErrorCode.VALIDATION_ERROR,
      message: ErrorMessage.VALIDATION_ERROR,
      details,
    });
  }

  // Prisma unique constraint or known DB errors
  // Prisma errors often expose a `code` like 'P2002' for unique constraint
  if (isPrismaLike(err)) {
    if (err.code === 'P2002') {
      const details = (err as any).meta || undefined;
      return sendFailure(res, {
        status: HttpStatus.CONFLICT,
        code: ErrorCode.UNIQUE_CONSTRAINT,
        message: ErrorMessage.CONFLICT,
        details,
      });
    }
  }

  // Fallback: internal server error
  return sendFailure(res, {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    code: ErrorCode.INTERNAL_ERROR,
    message: ErrorMessage.INTERNAL_SERVER_ERROR,
  });
}
