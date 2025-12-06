import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../prisma/client', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from '../prisma/client';
import { createUserService } from './userService';

describe('createUserService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('creates a user when email not taken', async () => {
    // use Vitest mocks directly (no jest types)
    (prisma.user.findUnique as any).mockResolvedValue(null);

    const createdUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      passwordHash: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.user.create as any).mockResolvedValue(createdUser);

    const result = await createUserService({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(createdUser.id);
  });

  it('throws 409 when email already exists', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ id: 1, email: 'a@b.com' });

    await expect(
      createUserService({ email: 'a@b.com', password: 'password123' }),
    ).rejects.toMatchObject({ message: 'User already exists', status: 409 });
  });
});
