import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as userService from './userService';
import { api } from '../utils/request';
import { ApiError } from '../utils/ApiErrors';

describe('userService.createUser', () => {
  let postSpy: any;

  beforeEach(() => {
    postSpy = vi.spyOn(api, 'post');
  });

  afterEach(() => {
    postSpy.mockRestore();
  });

  it('calls api.post and returns on success', async () => {
    const payload = { email: 'x@x.com', password: 'secret', firstName: 'A', lastName: 'B' };
    postSpy.mockResolvedValue({ id: 'u1', email: payload.email });

    const res = await userService.createUser(payload as any);
    expect(res).toEqual({ id: 'u1', email: payload.email });
    expect(postSpy).toHaveBeenCalledWith(
      '/api/users',
      payload,
      expect.objectContaining({ auth: false }),
    );
  });

  it('propagates ApiError when api.post rejects', async () => {
    const payload = { email: 'x', password: 'y' };
    const apiErr = new ApiError('Exists', 'USER_EXISTS', undefined, 409);
    postSpy.mockRejectedValue(apiErr);

    await expect(userService.createUser(payload as any)).rejects.toBe(apiErr);
  });

  it('passes AbortSignal through to api.post', async () => {
    const payload = { email: 'a', password: 'b' };
    postSpy.mockResolvedValue({ id: 'u2' });
    const ctrl = new AbortController();

    await userService.createUser(payload as any, ctrl.signal);

    expect(postSpy).toHaveBeenCalledWith('/api/users', payload, {
      auth: false,
      signal: ctrl.signal,
    });
  });
});
