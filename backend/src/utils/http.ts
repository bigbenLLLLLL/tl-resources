import type { Response } from 'express';
import type { ApiSuccess, ApiFailure } from '../../../shared/src/types/api';

export function sendSuccess<T = unknown>(res: Response, data?: T, status = 200) {
  const body: ApiSuccess<T> = { success: true, data: data as T };
  return res.status(status).json(body);
}

export function sendFailure(
  res: Response,
  status = 500,
  code = 'INTERNAL_ERROR',
  message = 'Internal Server Error',
) {
  const body: ApiFailure = { success: false, error: { code, message } };
  return res.status(status).json(body);
}
