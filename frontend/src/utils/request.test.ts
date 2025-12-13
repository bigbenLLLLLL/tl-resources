import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { request } from './request';
import { ApiError } from './ApiErrors';

function makeResponse({
  status = 200,
  body = '',
  contentType = 'application/json',
  ok = true,
} = {}) {
  return {
    ok,
    status,
    headers: { get: (k: string) => (k.toLowerCase() === 'content-type' ? contentType : null) },
    text: async () => body,
  } as unknown as Response;
}

describe('request util', () => {
  let fetchSpy: any;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('returns data when backend returns ApiSuccess', async () => {
    const payload = JSON.stringify({ success: true, data: { hello: 'world' } });
    fetchSpy.mockResolvedValue(makeResponse({ body: payload }));

    const data = await request('GET', '/test');
    expect(data).toEqual({ hello: 'world' });
  });

  it('throws ApiError when backend returns ApiFailure with HTTP 200', async () => {
    const payload = JSON.stringify({
      success: false,
      error: { code: 'INVALID', message: 'Bad', details: { field: 'x' } },
    });
    fetchSpy.mockResolvedValue(makeResponse({ body: payload }));

    await expect(request('POST', '/test')).rejects.toSatisfy((err: any) => {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toBe('Bad');
      expect(err.code).toBe('INVALID');
      expect(err.details).toEqual({ field: 'x' });
      return true;
    });
  });

  it('throws ApiError for non-2xx JSON failure and preserves status', async () => {
    const payload = JSON.stringify({
      success: false,
      error: { code: 'USER_EXISTS', message: 'User exists' },
    });
    fetchSpy.mockResolvedValue(makeResponse({ body: payload, ok: false, status: 409 }));

    await expect(request('POST', '/users')).rejects.toSatisfy((err: any) => {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.status).toBe(409);
      expect(err.code).toBe('USER_EXISTS');
      return true;
    });
  });

  it('returns undefined for 204 No Content', async () => {
    fetchSpy.mockResolvedValue(makeResponse({ status: 204, body: '', ok: true, contentType: '' }));
    const r = await request('DELETE', '/something');
    expect(r).toBeUndefined();
  });

  it('does not overwrite provided Content-Type header', async () => {
    // inspect headers passed to fetch
    fetchSpy.mockImplementation(async () =>
      makeResponse({ body: JSON.stringify({ success: true, data: null }) }),
    );

    const customHeaders = { 'Content-Type': 'multipart/form-data' };
    await request('POST', '/upload', { data: { a: 1 }, headers: customHeaders as any });

    const calledOpts = fetchSpy.mock.calls[0][1];
    expect(calledOpts.headers['Content-Type']).toBe('multipart/form-data');
  });
});
