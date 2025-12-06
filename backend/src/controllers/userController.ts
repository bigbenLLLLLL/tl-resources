import { Request, Response } from 'express';
import { createUserService } from '../services/userService';
import { sendSuccess, sendFailure } from '../utils/http';
import { HttpError } from '../errors/HttpError';

export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await createUserService(req.body);
    // return created id and 201 status
    return sendSuccess(res, result, 'User created', 201);
  } catch (err) {
    // Controller-level handling: return structured error response to client
    if (err instanceof HttpError) {
      return sendFailure(res, err.status, err.message, err.code, err.details);
    }

    // Fallback
    return sendFailure(res, 500, 'Internal Server Error');
  }
};
