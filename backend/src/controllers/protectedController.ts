import type { Request, Response } from 'express';
import { sendSuccess } from '../utils/http';
import { HttpStatus } from '../../../shared/src/types/api';

export const hello = async (req: Request, res: Response) => {
  return sendSuccess(res, { data: { message: 'hello world' }, status: HttpStatus.OK });
};

export default hello;
