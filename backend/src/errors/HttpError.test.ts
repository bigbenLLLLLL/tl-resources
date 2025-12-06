import { describe, it, expect } from 'vitest';
import { HttpError } from './HttpError';

describe('HttpError', () => {
  it('sets properties correctly', () => {
    const err = new HttpError(404, 'Not Found', 'NOT_FOUND', { foo: 'bar' });
    expect(err.status).toBe(404);
    expect(err.message).toBe('Not Found');
    expect(err.code).toBe('NOT_FOUND');
    expect(err.details).toEqual({ foo: 'bar' });
  });
});
