import type { Request, Response } from 'express';
import logger from '../utils/logger.js';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: 'Not Found' });
}

export function errorHandler(err: unknown, req: Request, res: Response) {
  try {
    logger.error({ err }, 'Unhandled error');
  } catch (error) {
    // fallback
    console.error(error);
  }

  res.status(500).json({ error: 'Internal Server Error' });
}
