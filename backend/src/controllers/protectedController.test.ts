import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth';
import { hello } from './protectedController';
import config from '../utils/config';

describe('protected hello route', () => {
  it('allows request with valid Bearer token and returns hello world', async () => {
    const token = jwt.sign({ sub: 123 }, process.env.JWT_SECRET ?? config.jwtSecret ?? 'change-me');

    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const res: any = { status, json };

    // next will call the controller
    const next = () => hello(req, res as any);

    authMiddleware(req, res, next as any);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      success: true,
      data: { message: 'hello world' },
    });
  });

  it('rejects request without Authorization header', () => {
    const req: any = { headers: {} };
    const res: any = {};
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeDefined();
    expect(err.status).toBe(401);
  });
});
