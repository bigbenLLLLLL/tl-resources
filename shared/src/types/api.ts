export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiErrorObject {
  code: string;
  message: string;
}

export interface ApiFailure {
  success: false;
  error: ApiErrorObject;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
