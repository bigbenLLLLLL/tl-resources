import { ErrorCode, HttpStatus, ErrorMessage } from '../../../shared/src/types/api';

export class HttpError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    message: string = ErrorMessage.INTERNAL_SERVER_ERROR,
    code: string = ErrorCode.INTERNAL_ERROR,
    details?: unknown,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
