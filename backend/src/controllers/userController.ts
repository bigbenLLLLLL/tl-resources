import { Request, Response } from 'express';
import { createUserService } from '../services/userService';
import { sendSuccess, sendFailure } from '../utils/http';
import { ErrorCode, ErrorMessage, HttpStatus } from '../../../shared/src/types/api';
import { HttpError } from '../errors/HttpError';

export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await createUserService(req.body);
    // return created id and 201 status
    return sendSuccess(res, { data: result, status: HttpStatus.CREATED });
  } catch (err) {
    // Controller-level handling: return structured error response to client
    if (err instanceof HttpError) {
      return sendFailure(res, {
        status: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
        code: err.code || ErrorCode.ERROR,
        message: err.message || ErrorMessage.ERROR,
        details: (err as any).details,
      });
    }

    // Fallback
    return sendFailure(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.INTERNAL_ERROR,
      message: ErrorMessage.INTERNAL_SERVER_ERROR,
    });
  }
};
