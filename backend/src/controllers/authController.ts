import type { Request, Response } from 'express';
import { loginService } from '../services/authService';
import { sendSuccess, sendFailure } from '../utils/http';
import { ErrorCode, ErrorMessage, HttpStatus } from '../../../shared/src/types/api';
import { HttpError } from '../errors/HttpError';

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body as { email: string; password: string });
    return sendSuccess(res, { data: result, status: HttpStatus.OK });
  } catch (err) {
    if (err instanceof HttpError) {
      return sendFailure(res, {
        status: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
        code: err.code || ErrorCode.ERROR,
        message: err.message || ErrorMessage.ERROR,
        details: (err as any).details,
      });
    }
    return sendFailure(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.INTERNAL_ERROR,
      message: ErrorMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

export default login;
