type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown | FormData;
  auth?: boolean;
  raw?: boolean;
};

const BASE = (import.meta.env.VITE_API_BASE_URL as string) || '';

function buildUrl(path: string, params?: Record<string, string | number | boolean>) {
  const url = new URL(path, BASE || window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

function getTokenFromStorage(): string | null {
  try {
    return localStorage.getItem('token');
  } catch (e) {
    console.error('Failed to get token from localStorage', e);
    return null;
  }
}

async function request<T = any>(method: HttpMethod, path: string, opts: RequestOptions = {}) {
  const { headers = {}, params, data, auth = true, raw = false } = opts;

  const url = buildUrl(path, params);

  const builtHeaders: Record<string, string> = { ...headers };

  let body: any;

  if (data instanceof FormData) {
    // Let fetch set the multipart boundary
    body = data;
  } else if (data !== undefined) {
    builtHeaders['Content-Type'] = builtHeaders['Content-Type'] || 'application/json';
    body = JSON.stringify(data);
  }

  if (auth) {
    const token = getTokenFromStorage();
    if (token) {
      builtHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    method,
    headers: builtHeaders,
    body,
    credentials: 'include',
  });

  if (raw) return res as unknown as T;

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    let payload: any = null;
    try {
      payload = isJson ? await res.json() : await res.text();
    } catch (e) {
      console.error('Failed to parse error response', e);
      payload = null;
    }
    const err: any = new Error(payload?.message || res.statusText || 'Request failed');
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  if (isJson) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}

// Helper methods
export const api = {
  request: <T = any>(method: HttpMethod, path: string, opts?: RequestOptions) =>
    request<T>(method, path, opts),
  get: <T = any>(path: string, opts?: Omit<RequestOptions, 'data'>) =>
    request<T>('GET', path, opts),
  post: <T = any>(path: string, data?: any, opts?: Omit<RequestOptions, 'data'>) =>
    request<T>('POST', path, { ...(opts || {}), data }),
  put: <T = any>(path: string, data?: any, opts?: Omit<RequestOptions, 'data'>) =>
    request<T>('PUT', path, { ...(opts || {}), data }),
  patch: <T = any>(path: string, data?: any, opts?: Omit<RequestOptions, 'data'>) =>
    request<T>('PATCH', path, { ...(opts || {}), data }),
  delete: <T = any>(path: string, opts?: Omit<RequestOptions, 'data'>) =>
    request<T>('DELETE', path, opts),
  // helper to set token programmatically
  setToken: (token: string | null) => {
    try {
      if (token) localStorage.setItem('token', token);
      else localStorage.removeItem('token');
    } catch (e) {
      console.error('Failed to set token in localStorage', e);
      // ignore
    }
  },
  getToken: getTokenFromStorage,
};

export default api;
