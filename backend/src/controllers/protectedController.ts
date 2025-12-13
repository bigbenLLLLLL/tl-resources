import type { Request, Response } from 'express';
import { sendSuccess } from '../utils/http';

export const hello = async (req: Request, res: Response) => {
  return sendSuccess(res, { message: 'hello world' }, 200);
};

export default hello;
