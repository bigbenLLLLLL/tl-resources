import type { Response } from 'express';

export type ApiResponse<T = unknown> = {
  success: boolean;
  status: number;
  message?: string;
  data?: T;
  error?: { code?: string; details?: unknown };
};

export function sendSuccess<T = unknown>(res: Response, data?: T, message = 'OK', status = 200) {
  const body: ApiResponse<T> = { success: true, status, message, data };
  return res.status(status).json(body);
}

export function sendFailure(
  res: Response,
  status = 500,
  message = 'Internal Server Error',
  code?: string,
  details?: unknown,
) {
  const body: ApiResponse = { success: false, status, message, error: { code, details } };
  return res.status(status).json(body);
}
