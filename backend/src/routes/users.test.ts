import { describe, it, expect } from 'vitest';
import usersRouter from './users';

describe('users router', () => {
  it('has a POST / route', () => {
    // Express Router stores routes in stack; look for a layer with POST method
    const stack: any[] = (usersRouter as any).stack || [];
    const hasPost = stack.some((layer) => {
      const route = layer.route;
      if (!route) return false;
      const methods = route.methods || {};
      return !!methods.post;
    });
    expect(hasPost).toBe(true);
  });
});
