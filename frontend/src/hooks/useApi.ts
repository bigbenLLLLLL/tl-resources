import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../utils/ApiErrors';

interface UseApiState<T> {
  data?: T;
  error?: ApiError | null;
  loading: boolean;
}

interface UseApiOptions {
  retry?: number; // number of retries
  autoThrow?: boolean; // throw error directly instead of catching inside hook
}

// eslint-disable-next-line no-unused-vars
export function useApi<T>(fn: (...args: any[]) => Promise<T>, options: UseApiOptions = {}) {
  const { retry = 0, autoThrow = false } = options;

  const [state, setState] = useState<UseApiState<T>>({
    loading: false,
    data: undefined,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // cleanup abort when unmount and mark unmounted
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      // cancel previous
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      let attempts = retry + 1;

      if (isMountedRef.current) setState((s) => ({ ...s, loading: true, error: null }));

      while (attempts > 0) {
        try {
          // pass abort signal as last argument (callers may ignore it)
          const data = await fn(...args, controller.signal);
          if (!controller.signal.aborted && isMountedRef.current) {
            setState({ loading: false, data, error: null });
          }
          return data;
        } catch (err: any) {
          attempts -= 1;

          if (controller.signal.aborted) {
            // request was aborted
            const abortedErr = new ApiError('Request aborted');
            if (isMountedRef.current) setState((s) => ({ ...s, loading: false }));
            throw abortedErr;
          }

          if (attempts > 0) continue;

          const apiError =
            err instanceof ApiError ? err : new ApiError(err?.message ?? 'Unknown error');

          if (isMountedRef.current) setState({ loading: false, data: undefined, error: apiError });

          if (autoThrow) throw apiError;

          return Promise.reject(apiError);
        }
      }

      throw new ApiError('Unknown error');
    },
    [fn, retry, autoThrow],
  );

  const reset = useCallback(() => {
    setState({ loading: false, data: undefined, error: null });
  }, []);

  return { ...state, execute, reset };
}
