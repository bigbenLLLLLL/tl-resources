import { useCallback } from 'react';
import { useAuthContext } from '../providers/AuthProvider';

export function useAuth() {
  const ctx = useAuthContext();

  const login = useCallback(
    async (credentials: any) => {
      if (!ctx.login) throw new Error('login not available');
      return ctx.login(credentials);
    },
    [ctx],
  );

  const logout = useCallback(() => ctx.logout(), [ctx]);

  const authenticate = useCallback(
    (token: string | null, user?: any) => ctx.authenticate(token, user),
    [ctx],
  );

  return {
    user: ctx.user,
    token: ctx.token,
    ready: ctx.ready,
    login,
    logout,
    authenticate,
  } as const;
}

export default useAuth;
