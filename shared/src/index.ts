export const noop = (): void => {};

// Re-export shared schemas and types for package-level imports
export { createUserSchema, type CreateUserInput } from './schemas/user';
export { loginSchema, type LoginInput } from './schemas/auth';
export type { ApiResponse, ApiSuccess, ApiFailure, ApiErrorObject } from './types/api';
