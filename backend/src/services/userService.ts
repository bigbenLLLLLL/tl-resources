import bcrypt from 'bcrypt';
import { findUserByEmail, createUser, CreateUserParams } from '../repositories/userRepository';
import { HttpError } from '../errors/HttpError';
import { ErrorCode, HttpStatus } from '../../../shared/src/types/api';
import type { CreateUserInput } from '../../../shared/src/schemas/user';

export const createUserService = async (payload: CreateUserInput) => {
  const email = payload?.email;
  const password = payload?.password;

  if (!email || !password) {
    throw new HttpError(
      HttpStatus.BAD_REQUEST,
      'Invalid input: email and password are required',
      ErrorCode.INVALID_INPUT,
    );
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new HttpError(HttpStatus.CONFLICT, 'User already exists', ErrorCode.USER_EXISTS);
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
