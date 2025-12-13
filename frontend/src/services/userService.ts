import { post } from '../utils/request';
import type { CreateUserInput } from '../../../shared/src/index';

// createUser should not send auth token
export const createUser = async (payload: CreateUserInput) => {
  return post('/api/users', payload, { skipAuth: true });
};

export default { createUser };
