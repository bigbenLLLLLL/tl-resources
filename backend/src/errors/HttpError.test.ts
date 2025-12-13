import { describe, it, expect } from 'vitest';
import { HttpError } from './HttpError';
import { ErrorCode, HttpStatus, ErrorMessage } from '../../../shared/src/types/api';

describe('HttpError', () => {
  it('sets properties correctly', () => {
    const err = new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND, ErrorCode.NOT_FOUND, {
      foo: 'bar',
    });
    expect(err.status).toBe(HttpStatus.NOT_FOUND);
    expect(err.message).toBe(ErrorMessage.NOT_FOUND);
    expect(err.code).toBe(ErrorCode.NOT_FOUND);
    expect(err.details).toEqual({ foo: 'bar' });
  });
});
