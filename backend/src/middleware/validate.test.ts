import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { validate } from './validate';

describe('validate middleware', () => {
  it('calls next and replaces req.body on valid payload', () => {
    const schema = z.object({ email: z.string().email() });
    const mw = validate(schema as any);
    const req: any = { body: { email: 'a@b.com' } };
    const res: any = {};
    const next = vi.fn();

    mw(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body.email).toBe('a@b.com');
  });

  it('returns 400 and json on invalid payload', () => {
    const schema = z.object({ email: z.string().email() });
    const mw = validate(schema as any);
    const req: any = { body: { email: 'bad' } };
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const res: any = { status };
    const next = vi.fn();

    mw(req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
