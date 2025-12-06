import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '../repositories/userRepository';
import { HttpError } from '../errors/HttpError';
import config from '../utils/config';

type LoginInput = {
  email: string;
  password: string;
};

export const loginService = async (payload: LoginInput) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw new HttpError(400, 'Email and password required', 'INVALID_INPUT');
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new HttpError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new HttpError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
  }

  const secret: Secret = config.jwtSecret ?? process.env.JWT_SECRET ?? 'change-me';
  const expiresIn = (config.jwtExpiresIn ??
    process.env.JWT_EXPIRES_IN ??
    '1h') as SignOptions['expiresIn'];

  const token = jwt.sign({ sub: user.id }, secret, { expiresIn });

  return { token, id: user.id };
};

export default loginService;
