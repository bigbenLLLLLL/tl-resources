import { vi, describe, it, expect, beforeEach } from 'vitest';
import { HttpStatus, ErrorCode } from '../../../shared/src/types/api';

import { createUser } from './userController';

vi.mock('../services/userService', () => ({
  createUserService: vi.fn(),
}));

import { createUserService } from '../services/userService';

describe('userController.createUser', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 201 and id on success', async () => {
    (createUserService as any).mockResolvedValue({ id: 42 });

    const req: any = { body: { email: 'a@b.com', password: 'pass' } };
    const status = vi.fn().mockReturnThis();
    const json = vi.fn();
    const res: any = { status, json };

    await createUser(req, res);

    expect(status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(json).toHaveBeenCalledWith({
      success: true,
      data: { id: 42 },
    });
  });

  it('returns structured error on HttpError', async () => {
    const HttpError = (await import('../errors/HttpError')).HttpError;
    (createUserService as any).mockRejectedValue(
      new HttpError(HttpStatus.CONFLICT, 'User exists', ErrorCode.USER_EXISTS),
    );

    const req: any = { body: { email: 'a@b.com', password: 'pass' } };
    const status = vi.fn().mockReturnThis();
    const json = vi.fn();
    const res: any = { status, json };

    await createUser(req, res);

    expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: { code: ErrorCode.USER_EXISTS, message: 'User exists' },
    });
  });
});
