import { z } from 'zod';
import bcrypt from 'bcrypt';
import { findUserByEmail, createUser, CreateUserParams } from '../repositories/userRepository';

const createUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const createUserService = async (payload: CreateUserInput) => {
  const parsed = createUserSchema.parse(payload);

  const existing = await findUserByEmail(parsed.email);
  if (existing) {
    const err: any = new Error('User already exists');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(parsed.password, 10);

  const createParams: CreateUserParams = {
    email: parsed.email,
    passwordHash,
    firstName: parsed.firstName ?? null,
    lastName: parsed.lastName ?? null,
  };

  const user = await createUser(createParams);

  // return only the created user's id for logging
  return { id: (user as any).id };
};
