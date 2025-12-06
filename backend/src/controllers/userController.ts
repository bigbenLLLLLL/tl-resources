import { Request, Response, NextFunction } from 'express';
import { createUserService } from '../services/userService';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createUserService(req.body);
    return res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
};
