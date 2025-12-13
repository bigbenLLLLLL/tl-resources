import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as authService from './authService';
import { api } from '../utils/request';
import { ApiError } from '../utils/ApiErrors';

describe('authService.login', () => {
  let postSpy: any;

  beforeEach(() => {
    postSpy = vi.spyOn(api, 'post');
  });

  afterEach(() => {
    postSpy.mockRestore();
  });

  it('returns token and id on success', async () => {
    const payload = { email: 'a@b.com', password: 'pwd' };
    postSpy.mockResolvedValue({ token: 't', id: 'u' });

    const res = await authService.login(payload);
    expect(res).toEqual({ token: 't', id: 'u' });
    expect(postSpy).toHaveBeenCalledWith(
      '/api/auth/login',
      payload,
      expect.objectContaining({ auth: false }),
    );
  });

  it('throws ApiError when api.post rejects with ApiError', async () => {
    const payload = { email: 'x', password: 'y' };
    const apiErr = new ApiError('Bad', 'INVALID', { field: 'email' }, 401);
    postSpy.mockRejectedValue(apiErr);

    await expect(authService.login(payload)).rejects.toBe(apiErr);
  });

  it('passes AbortSignal through to api.post', async () => {
    const payload = { email: 'a', password: 'b' };
    postSpy.mockResolvedValue({ token: 't', id: 'u' });
    const ctrl = new AbortController();

    await authService.login(payload, ctrl.signal);

    expect(postSpy).toHaveBeenCalledWith('/api/auth/login', payload, {
      auth: false,
      signal: ctrl.signal,
    });
  });
});
