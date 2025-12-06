import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import { HttpError } from '../errors/HttpError';

export interface AuthRequest extends Request {
  userId?: number | string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers['authorization'];
  if (!auth || typeof auth !== 'string' || !auth.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Missing Authorization', 'UNAUTHORIZED'));
  }

  const token = auth.slice(7).trim();
  const secret = config.jwtSecret ?? process.env.JWT_SECRET ?? 'change-me';

  try {
    const payload = jwt.verify(token, secret) as any;
    req.userId = payload?.sub;
    return next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return next(new HttpError(401, 'Invalid token', 'UNAUTHORIZED'));
  }
}

export default authMiddleware;
