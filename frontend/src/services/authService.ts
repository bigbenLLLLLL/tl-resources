import { post } from '../utils/request';
import type { LoginInput } from '../../../shared/src/index';

// login does not require existing token
export const login = async (payload: LoginInput) => {
  const res = await post('/api/auth/login', payload, { skipAuth: true });
  // backend wraps data in { success, status, message, data }
  return res && res.data ? res.data : res;
};

export default { login };
