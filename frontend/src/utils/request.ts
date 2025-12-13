// frontend/src/services/request.ts
import type { ApiResponse, ApiFailure } from '../../../shared/src/types/api';
import { HttpStatus, ErrorCode } from '../../../shared/src/types/api';
import { ApiError } from './ApiErrors';

/** Allowed HTTP methods */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Extra request options */
export type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown | FormData;
  auth?: boolean;
  raw?: boolean; // return raw Response (file download, etc.)
  signal?: AbortSignal; // optional abort signal to cancel request
};

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';

/** Build URL with query params */
function buildUrl(path: string, params?: Record<string, string | number | boolean>) {
  const base =
    BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  const url = new URL(path, base);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

/** Read token */
function getToken() {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

/** Set token (helper for auth flows) */
export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  } catch {
    // ignore storage errors
  }
}

export { getToken };

/** Core request function */
export async function request<T = any>(
  method: HttpMethod,
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const { headers = {}, params, data, auth = true, raw = false, signal } = opts;

  const url = buildUrl(path, params);

  // Build headers
  const finalHeaders: Record<string, string> = {
    ...headers,
  };

  // eslint-disable-next-line no-undef
  let body: BodyInit | undefined;

  if (data instanceof FormData) {
    body = data;
  } else if (data !== undefined) {
    // Only set Content-Type if caller didn't provide one (case-insensitive)
    const hasContentType = Object.keys(finalHeaders).some(
      (k) => k.toLowerCase() === 'content-type',
    );
    if (!hasContentType) finalHeaders['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }

  if (auth) {
    const token = getToken();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body,
    credentials: 'include',
    signal,
  });

  if (raw) {
    if (!res.ok) throw new ApiError(res.statusText, undefined, undefined, res.status);
    return res as unknown as T;
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let payload: any = null;

  // Short-circuit No Content
  if (res.status === HttpStatus.NO_CONTENT) return undefined as unknown as T;

  if (isJson) {
    try {
      // read as text then parse only if non-empty (safer for empty bodies)
      const txt = await res.text();
      payload = txt ? JSON.parse(txt) : null;
    } catch {
      payload = null;
    }
  } else {
    try {
      payload = await res.text();
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    if (payload && typeof payload === 'object' && payload.success === false && payload.error) {
      const failure = payload as ApiFailure;
      throw new ApiError(
        failure.error.message,
        failure.error.code,
        failure.error.details,
        res.status,
        payload,
      );
    }

    const message = payload?.message || res.statusText || 'Request failed';

    throw new ApiError(message, ErrorCode.INTERNAL_ERROR, payload, res.status, payload);
  }

  if (isJson) {
    const resp = payload as ApiResponse<T>;

    if (resp.success === true) {
      return resp.data as T;
    }

    if (resp.success === false) {
      throw new ApiError(
        resp.error.message,
        resp.error.code,
        resp.error.details,
        res.status,
        payload,
      );
    }

    throw new ApiError(
      'Invalid API response format',
      ErrorCode.ERROR,
      payload,
      res.status,
      payload,
    );
  }
  return payload as T;
}

/** Shorthand */
export const api = {
  request,
  get: <T>(path: string, opts?: Omit<RequestOptions, 'data'>) => request<T>('GET', path, opts),
  post: <T>(path: string, data?: any, opts?: Omit<RequestOptions, 'data'>) =>
    request<T>('POST', path, { ...(opts || {}), data }),
  put: <T>(path: string, data?: any, opts?: Omit<RequestOptions, 'data'>) =>
    request<T>('PUT', path, { ...(opts || {}), data }),
  patch: <T>(path: string, data?: any, opts?: Omit<RequestOptions, 'data'>) =>
    request<T>('PATCH', path, { ...(opts || {}), data }),
  delete: <T>(path: string, opts?: Omit<RequestOptions, 'data'>) =>
    request<T>('DELETE', path, opts),
};
