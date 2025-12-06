import type { Request, Response } from 'express';
import { loginService } from '../services/authService';
import { sendSuccess, sendFailure } from '../utils/http';
import { HttpError } from '../errors/HttpError';

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body as { email: string; password: string });
    return sendSuccess(res, result, 'Logged in', 200);
  } catch (err) {
    if (err instanceof HttpError) {
      return sendFailure(res, err.status, err.message, err.code, err.details);
    }
    return sendFailure(res, 500, 'Internal Server Error');
  }
};

export default login;
