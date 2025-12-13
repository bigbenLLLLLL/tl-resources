/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { actAsync, executeAndWait, attachNoopCatch } from '../utils/testUtils';
import { useApi } from './useApi';
import { ApiError } from '../utils/ApiErrors';

function TestWrapper({
  fn,
  onReady,
}: {
  fn: (...args: any[]) => Promise<any>;
  onReady?: (helpers: any) => void;
}) {
  const { data, loading, error, execute, reset } = useApi(fn as any);
  useEffect(() => {
    onReady?.({ execute, reset, getState: () => ({ data, loading, error }) });
  }, [execute, reset, data, loading, error, onReady]);

  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="data">{data === undefined ? '' : JSON.stringify(data)}</div>
      <div data-testid="error">{error ? error.message : ''}</div>
    </div>
  );
}

describe('useApi hook', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('handles success and updates state', async () => {
    const fn = vi.fn(async (_arg: any, _signal?: AbortSignal) => {
      return { ok: true };
    });

    let helpers: any;
    render(<TestWrapper fn={fn} onReady={(h) => (helpers = h)} />);

    // execute and await
    let result: any;
    result = await executeAndWait(() => helpers.execute());

    expect(result).toEqual({ ok: true });
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('data').textContent).toBe(JSON.stringify({ ok: true }));
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('wraps thrown errors as ApiError and sets state', async () => {
    const fn = vi.fn(async () => {
      throw new Error('boom');
    });

    let helpers: any;
    render(<TestWrapper fn={fn} onReady={(h) => (helpers = h)} />);

    await actAsync(async () => {
      await expect(helpers.execute()).rejects.toBeInstanceOf(ApiError);
    });

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('error').textContent).toBe('boom');
  });

  it('aborts previous request when execute called again', async () => {
    // fn returns a promise that rejects when signal aborted
    // read signal from the last argument so test works whether signal is passed as
    // the only arg or as a second arg (helpers.execute() is called without args)
    const fn = vi.fn((...args: any[]) => {
      const signal = args[args.length - 1] as AbortSignal | undefined;
      return new Promise((resolve, reject) => {
        if (!signal) return; // should not happen in this test
        signal.addEventListener('abort', () => reject(new Error('aborted')));
        // never resolve otherwise
      });
    });

    let helpers: any;
    render(<TestWrapper fn={fn} onReady={(h) => (helpers = h)} />);

    let p1: Promise<any>;

    p1 = helpers.execute();
    attachNoopCatch(p1);

    await actAsync(async () => {
      const p2 = helpers.execute();
      attachNoopCatch(p2);
    });

    await expect(p1).rejects.toBeInstanceOf(ApiError);
  });

  it('retries failed calls up to retry count and succeeds', async () => {
    let calls = 0;
    const fn = vi.fn(async () => {
      calls += 1;
      if (calls < 3) throw new Error('temporary');
      return 'ok';
    });

    let helpers: any;
    render(<TestWrapper fn={fn} onReady={(h) => (helpers = h)} />);

    // create a hook with retry=2 by calling useApi directly in a nested component
    // We'll render a separate wrapper that passes options via closure
    // Simpler: call execute and rely on default retry=0; to test retry we need to create custom hook instance
    // Implement a small inline component to pass options
    function RetryWrapper() {
      const { execute } = useApi(fn as any, { retry: 2 });
      useEffect(() => {
        // no-op
      }, []);
      // expose for test via global
      (global as any).__retryExec = execute;
      return null;
    }

    render(<RetryWrapper />);

    await actAsync(async () => {
      const value = await (global as any).__retryExec();
      expect(value).toBe('ok');
    });
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('reset clears state', async () => {
    const fn = vi.fn(async () => 'x');
    let helpers: any;
    render(<TestWrapper fn={fn} onReady={(h) => (helpers = h)} />);

    await executeAndWait(() => helpers.execute());

    expect(screen.getByTestId('data').textContent).toBe(JSON.stringify('x'));

    await actAsync(async () => {
      helpers.reset();
    });

    expect(screen.getByTestId('data').textContent).toBe('');
    expect(screen.getByTestId('loading').textContent).toBe('false');
  });
});
