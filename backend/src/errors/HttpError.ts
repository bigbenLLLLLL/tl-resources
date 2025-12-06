export class HttpError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(status = 500, message = 'Internal Server Error', code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
