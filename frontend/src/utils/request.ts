export type Maybe<T> = T | undefined;

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';
const TOKEN_KEY = 'auth_token';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function buildQuery(params?: Record<string, any>): string {
  if (!params) return '';
  const esc = encodeURIComponent;
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      if (Array.isArray(v)) return v.map((x) => `${esc(k)}=${esc(String(x))}`).join('&');
      return `${esc(k)}=${esc(String(v))}`;
    })
    .join('&');
  return query ? `?${query}` : '';
}

export function setToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('Failed to set token in localStorage', e);
  }
}

export function getToken(): Maybe<string> {
  try {
    return localStorage.getItem(TOKEN_KEY) || undefined;
  } catch (e) {
    console.error('Failed to get token from localStorage', e);
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Failed to remove token from localStorage', e);
  }
}

export type RequestOptions = {
  method?: string;
  params?: Record<string, any>;
  data?: any;
  headers?: any;
  skipAuth?: boolean;
};

export async function request<T = any>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', params, data, headers = {}, skipAuth = false } = opts;
  const query = buildQuery(params);
  const url = `${BASE_URL}${path}${query}`;

  const h: Record<string, string> = {};
  // don't set content-type for FormData
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  if (!isFormData && data !== undefined && data !== null && method !== 'GET') {
    h['Content-Type'] = 'application/json';
  }

  // attach extra provided headers
  Object.assign(h, headers as Record<string, string>);

  if (!skipAuth) {
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
  }

  const init: any = {
    method,
    headers: h,
  };

  if (data !== undefined && data !== null && method !== 'GET') {
    init.body = isFormData ? (data as FormData) : JSON.stringify(data);
  }

  const res = await fetch(url, init);

  const contentType = res.headers.get('content-type') || '';
  let parsed: any = undefined;
  if (contentType.includes('application/json')) {
    parsed = await res.json();
  } else {
    parsed = await res.text();
  }

  if (!res.ok) {
    // If backend follows shared ApiResponse shape, try to extract error message
    if (
      parsed &&
      typeof parsed === 'object' &&
      'success' in parsed &&
      parsed.success === false &&
      parsed.error
    ) {
      const errObj = (parsed as any).error;
      const message = errObj?.message || res.statusText || '请求出错';
      throw new ApiError(message, res.status, parsed);
    }

    const message = (parsed && parsed.message) || res.statusText || '请求出错';
    throw new ApiError(message, res.status, parsed);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  // If backend returns shared ApiResponse<T> shape, unwrap data
  if (parsed && typeof parsed === 'object' && 'success' in parsed) {
    if ((parsed as any).success === true) return (parsed as any).data as T;
    // success === false was already handled above for non-ok responses, but handle defensively
    const errObj = (parsed as any).error;
    const message = errObj?.message || '请求出错';
    throw new ApiError(message, res.status, parsed);
  }

  return parsed as T;
}

export const get = <T = any>(
  path: string,
  params?: Record<string, any>,
  opts?: Omit<RequestOptions, 'params' | 'method'>,
) => request<T>(path, { ...(opts || {}), params, method: 'GET' });

export const post = <T = any>(
  path: string,
  data?: any,
  opts?: Omit<RequestOptions, 'data' | 'method'>,
) => request<T>(path, { ...(opts || {}), data, method: 'POST' });

export const put = <T = any>(
  path: string,
  data?: any,
  opts?: Omit<RequestOptions, 'data' | 'method'>,
) => request<T>(path, { ...(opts || {}), data, method: 'PUT' });

export const del = <T = any>(
  path: string,
  data?: any,
  opts?: Omit<RequestOptions, 'data' | 'method'>,
) => request<T>(path, { ...(opts || {}), data, method: 'DELETE' });

export default {
  request,
  get,
  post,
  put,
  del,
  setToken,
  getToken,
  clearToken,
};
