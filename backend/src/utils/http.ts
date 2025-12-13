import type { Response } from 'express';
import {
  ErrorCode,
  HttpStatus,
  ErrorMessage,
  ApiSuccess,
  ApiFailure,
  FailureOptions,
} from '../../../shared/src/types/api';

export function sendSuccess<T = unknown>(
  res: Response,
  opts?: { status?: number | HttpStatus; data?: T },
) {
  const { status = HttpStatus.OK, data } = opts || {};
  const body: ApiSuccess<T> = { success: true } as ApiSuccess<T>;
  if (data !== undefined) body.data = data as T;
  return res.status(status as number).json(body);
}

export function sendFailure(res: Response, opts?: FailureOptions) {
  const {
    status = HttpStatus.INTERNAL_SERVER_ERROR,
    code = ErrorCode.INTERNAL_ERROR,
    message = ErrorMessage.INTERNAL_SERVER_ERROR,
    details,
  } = opts || {};
  const body: ApiFailure = { success: false, error: { code: code as string, message } };
  if (details !== undefined) body.error.details = details;
  return res.status(status as number).json(body);
}
