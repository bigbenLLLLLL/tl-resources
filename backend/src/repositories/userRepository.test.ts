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
import { findUserByEmail, createUser } from './userRepository';

describe('userRepository', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls prisma.findUnique with email', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);
    await findUserByEmail('a@b.com');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'a@b.com' } });
  });

  it('calls prisma.create with mapped data', async () => {
    const payload = {
      email: 'x@y.com',
      passwordHash: 'hash',
      firstName: 'X',
      lastName: 'Y',
    };
    (prisma.user.create as any).mockResolvedValue({ id: 1, ...payload });
    await createUser(payload as any);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: payload.email,
        passwordHash: payload.passwordHash,
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
    });
  });
});
