import { describe, it, expect, vi } from 'vitest';
import { ZodError, z } from 'zod';
import { errorHandler } from './errorHandler';
import { HttpError } from '../errors/HttpError';

describe('errorHandler middleware', () => {
  const makeRes = () => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    return { status, json } as any;
  };

  it('maps HttpError to response', () => {
    const req: any = { path: '/x', method: 'POST' };
    const res = makeRes();

    const err = new HttpError(409, 'User exists', 'USER_EXISTS');

    errorHandler(err, req, res, vi.fn() as any);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'USER_EXISTS', message: 'User exists' },
    });
  });

  it('maps ZodError to 422', () => {
    const req: any = { path: '/x', method: 'POST' };
    const res = makeRes();

    const schema = z.object({ email: z.string().email() });
    const result = schema.safeParse({ email: 'bad' });
    const err = result.error as ZodError;

    errorHandler(err, req, res, vi.fn() as any);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Validation Error' },
    });
  });

  it('maps Prisma P2002 like error to 409', () => {
    const req: any = { path: '/x', method: 'POST' };
    const res = makeRes();

    const err: any = { code: 'P2002', meta: { target: ['email'] } };

    errorHandler(err, req, res, vi.fn() as any);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'UNIQUE_CONSTRAINT', message: 'Conflict' },
    });
  });

  it('maps unknown error to 500', () => {
    const req: any = { path: '/x', method: 'POST' };
    const res = makeRes();

    const err = new Error('boom');

    errorHandler(err, req, res, vi.fn() as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' },
    });
  });
});
