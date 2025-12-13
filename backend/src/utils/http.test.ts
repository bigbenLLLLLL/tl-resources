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
    // sendSuccess signature: (res, data?, status = 200)
    sendSuccess(res, { id: '123' }, 201);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: '123' },
    });
  });

  it('sendFailure sends correct shape and status', () => {
    const res = makeRes();
    // sendFailure signature: (res, status = 500, code = 'INTERNAL_ERROR', message = 'Internal Server Error')
    sendFailure(res, 400, 'BAD_CODE', 'Bad');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'BAD_CODE', message: 'Bad' },
    });
  });
});
