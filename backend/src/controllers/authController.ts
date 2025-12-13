import type { Request, Response } from 'express';
import { loginService } from '../services/authService';
import { sendSuccess, sendFailure } from '../utils/http';
import { HttpError } from '../errors/HttpError';

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body as { email: string; password: string });
    return sendSuccess(res, result, 200);
  } catch (err) {
    if (err instanceof HttpError) {
      return sendFailure(res, err.status || 500, err.code || 'ERROR', err.message || 'Error');
    }
    return sendFailure(res, 500, 'INTERNAL_ERROR', 'Internal Server Error');
  }
};

export default login;
