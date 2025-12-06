import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginService } from './authService';
import { HttpError } from '../errors/HttpError';

import * as userRepo from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('loginService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns token and id on success', async () => {
    vi.spyOn(userRepo, 'findUserByEmail').mockResolvedValue({
      id: 1,
      passwordHash: await bcrypt.hash('pass', 10),
    } as any);
    const res = await loginService({ email: 'a@b.com', password: 'pass' });
    expect(res).toHaveProperty('token');
    expect(res).toHaveProperty('id', 1);
    // verify token decodes
    const payload: any = jwt.decode(res.token as string);
    expect(payload.sub).toBe(1);
  });

  it('throws HttpError on bad credentials', async () => {
    vi.spyOn(userRepo, 'findUserByEmail').mockResolvedValue(null as any);
    await expect(loginService({ email: 'no@one', password: 'x' })).rejects.toBeInstanceOf(
      HttpError,
    );
  });
});
