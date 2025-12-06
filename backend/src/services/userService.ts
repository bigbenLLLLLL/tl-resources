import * as userRepo from '../repositories/userRepository';
import bcrypt from 'bcrypt';

export async function registerUser(payload: {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}) {
  const { email, password, firstName, lastName } = payload;

  // check existing
  const existing = await userRepo.findUserByEmail(email);
  if (existing) {
    const err: any = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  // hash password
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await userRepo.createUser({
    email,
    passwordHash,
    firstName: firstName ?? null,
    lastName: lastName ?? null,
  });
  // remove passwordHash from returned object for safety
  // @ts-ignore
  delete user.passwordHash;
  return user;
}
