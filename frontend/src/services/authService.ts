import { post } from '../utils/request';
import type { LoginInput } from '../../../shared/src/index';

// login does not require existing token
export const login = async (payload: LoginInput) => {
  // backend now returns shared ApiResponse<T> and request() unwraps data, so we get the payload directly
  const data = await post('/api/auth/login', payload, { skipAuth: true });
  return data;
};

export default { login };
