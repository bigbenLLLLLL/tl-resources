import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authMiddleware } from './auth';
import { HttpStatus } from '../../../shared/src/types/api';
import jwt from 'jsonwebtoken';

describe('authMiddleware', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('rejects missing auth header', () => {
    const req: any = { headers: {} };
    const res: any = {};
    const next = vi.fn();
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeDefined();
    expect(err.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('accepts valid token and sets userId', () => {
    const token = jwt.sign({ sub: 5 }, process.env.JWT_SECRET ?? 'change-me');
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const res: any = {};
    const next = vi.fn();
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.userId).toBe(5);
  });
});
