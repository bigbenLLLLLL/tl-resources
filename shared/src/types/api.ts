/* eslint-disable no-unused-vars */
export interface ApiSuccess<T = undefined> {
  success: true;
  data?: T;
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorMessage {
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  VALIDATION_ERROR = 'Validation Error',
  INVALID_INPUT = 'Invalid input',
  INVALID_CREDENTIALS = 'Invalid credentials',
  UNAUTHORIZED = 'Unauthorized',
  CONFLICT = 'Conflict',
  NOT_FOUND = 'Not Found',
  ERROR = 'Error',
}

export enum ErrorCode {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNIQUE_CONSTRAINT = 'UNIQUE_CONSTRAINT',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_INPUT = 'INVALID_INPUT',
  NOT_FOUND = 'NOT_FOUND',
  USER_EXISTS = 'USER_EXISTS',
  ERROR = 'ERROR',
}

export interface ApiErrorObject {
  code: ErrorCode | string;
  message: string;
  details?: unknown;
}

export interface ApiFailure {
  success: false;
  error: ApiErrorObject;
}

export type FailureOptions = Partial<{
  status: number | HttpStatus;
  code: string | ErrorCode;
  message: string;
  details: unknown;
}>;

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
