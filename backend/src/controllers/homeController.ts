import { Request, Response } from 'express';
import * as homeService from '../services/homeService';

export const getRoot = (req: Request, res: Response) => {
  const status = homeService.getStatus();
  res.json(status);
};
