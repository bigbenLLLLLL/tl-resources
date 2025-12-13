import { describe, it, expect, vi } from 'vitest';
import { ZodError, z } from 'zod';
import { errorHandler } from './errorHandler';
import { HttpError } from '../errors/HttpError';
import { ErrorCode, ErrorMessage, HttpStatus } from '../../../shared/src/types/api';

describe('errorHandler middleware', () => {
  const makeRes = () => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    return { status, json } as any;
  };

  it('maps HttpError to response', () => {
    const req: any = { path: '/x', method: 'POST' };
    const res = makeRes();

    const err = new HttpError(HttpStatus.CONFLICT, 'User exists', ErrorCode.USER_EXISTS);

    errorHandler(err, req, res, vi.fn() as any);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: ErrorCode.USER_EXISTS, message: 'User exists' },
    });
  });

  it('maps ZodError to 422', () => {
    const req: any = { path: '/x', method: 'POST' };
    const res = makeRes();

    const schema = z.object({ email: z.string().email() });
    const result = schema.safeParse({ email: 'bad' });
    const err = result.error as ZodError;

    errorHandler(err, req, res, vi.fn() as any);

    const expectedDetails = err.flatten ? err.flatten() : { issues: err.issues };

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: ErrorMessage.VALIDATION_ERROR,
        details: expectedDetails,
      },
    });
  });

  it('maps Prisma P2002 like error to 409', () => {
    const req: any = { path: '/x', method: 'POST' };
    const res = makeRes();

    const err: any = { code: 'P2002', meta: { target: ['email'] } };

    errorHandler(err, req, res, vi.fn() as any);

    const expectedDetails = err.meta;

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: ErrorCode.UNIQUE_CONSTRAINT,
        message: ErrorMessage.CONFLICT,
        details: expectedDetails,
      },
    });
  });

  it('maps unknown error to 500', () => {
    const req: any = { path: '/x', method: 'POST' };
    const res = makeRes();

    const err = new Error('boom');

    errorHandler(err, req, res, vi.fn() as any);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: ErrorCode.INTERNAL_ERROR, message: ErrorMessage.INTERNAL_SERVER_ERROR },
    });
  });
});
