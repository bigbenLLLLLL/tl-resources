import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userService from './userService';
import * as userRepo from '../repositories/userRepository';
import bcrypt from 'bcrypt';

vi.mock('../repositories/userRepository');
vi.mock('bcrypt');

describe('userService.registerUser', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('registers new user and hashes password', async () => {
    (userRepo.findUserByEmail as any).mockResolvedValue(null);
    (bcrypt.hash as any).mockResolvedValue('hashed');
    (userRepo.createUser as any).mockResolvedValue({
      id: 1,
      email: 'a@b.com',
      passwordHash: 'hashed',
    });

    const res = await userService.registerUser({
      email: 'a@b.com',
      password: 'pass',
      firstName: 'A',
      lastName: 'B',
    });
    expect(res).toHaveProperty('id');
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(userRepo.createUser).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'a@b.com', passwordHash: 'hashed' }),
    );
  });

  it('throws 409 if email exists', async () => {
    (userRepo.findUserByEmail as any).mockResolvedValue({ id: 2, email: 'a@b.com' });
    await expect(
      userService.registerUser({ email: 'a@b.com', password: 'x' }),
    ).rejects.toMatchObject({ status: 409 });
  });
});
