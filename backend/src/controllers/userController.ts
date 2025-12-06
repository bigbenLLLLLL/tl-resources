import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const user = await userService.registerUser({ firstName, lastName, email, password });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
