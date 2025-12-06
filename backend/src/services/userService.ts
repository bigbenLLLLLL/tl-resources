import bcrypt from 'bcrypt';
import { findUserByEmail, createUser, CreateUserParams } from '../repositories/userRepository';
import { HttpError } from '../errors/HttpError';
import type { CreateUserInput } from '../../../shared/src/schemas/user';

export const createUserService = async (payload: CreateUserInput) => {
  const email = payload?.email;
  const password = payload?.password;

  if (!email || !password) {
    throw new HttpError(400, 'Invalid input: email and password are required', 'INVALID_INPUT');
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new HttpError(409, 'User already exists', 'USER_EXISTS');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const createParams: CreateUserParams = {
    email,
    passwordHash,
    firstName: payload?.firstName ?? null,
    lastName: payload?.lastName ?? null,
  };

  const user = await createUser(createParams);

  // return only the created user's id for logging
  return { id: user.id };
};
