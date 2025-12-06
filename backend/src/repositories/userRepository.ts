import { prisma } from '../prisma/client';

export type CreateUserParams = {
  email: string;
  passwordHash: string;
  firstName?: string | null;
  lastName?: string | null;
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: CreateUserParams) => {
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
    },
  });
};
