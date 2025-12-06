import { describe, it, expect, vi } from 'vitest';
import { sendSuccess, sendFailure } from './http';

describe('http utils', () => {
  const makeRes = () => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    return { status, json } as any;
  };

  it('sendSuccess sends correct shape and status', () => {
    const res = makeRes();
    // sendSuccess signature: (res, data?, message = 'OK', status = 200)
    sendSuccess(res, { id: '123' }, 'Created', 201);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      status: 201,
      message: 'Created',
      data: { id: '123' },
    });
  });

  it('sendFailure sends correct shape and status', () => {
    const res = makeRes();
    // sendFailure signature: (res, status = 500, message = 'Internal Server Error', code?: string, details?: unknown)
    sendFailure(res, 400, 'Bad', 'BAD');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 400,
      message: 'Bad',
      error: { code: 'BAD', details: undefined },
    });
  });
});
