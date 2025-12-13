import { describe, it, expect, vi } from 'vitest';
import { sendSuccess, sendFailure } from './http';
import { HttpStatus } from '../../../shared/src/types/api';

describe('http utils', () => {
  const makeRes = () => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    return { status, json } as any;
  };

  it('sendSuccess sends correct shape and status', () => {
    const res = makeRes();
    // sendSuccess signature: sendSuccess(res, { data?, status? })
    sendSuccess(res, { data: { id: '123' }, status: 201 });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: '123' },
    });
  });

  it('sendFailure sends correct shape and status', () => {
    const res = makeRes();
    // sendFailure signature: sendFailure(res, { status, code, message, details? })
    sendFailure(res, { status: HttpStatus.BAD_REQUEST, code: 'BAD_CODE', message: 'Bad' });
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'BAD_CODE', message: 'Bad' },
    });
  });
});
