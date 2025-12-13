import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getToken, setToken } from '../utils/request';
import * as authService from '../services/authService';
import type { LoginResponse } from '../../../shared/src/schemas/auth';

type User = { id: string } | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  ready: boolean;
  login?: (_credentials: any) => Promise<any>;
  logout: () => void;
  authenticate: (_token: string | null, _user?: User) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);
  const [ready, setReady] = useState(false);

  // initialize from localStorage
  useEffect(() => {
    const t = getToken();
    if (t) {
      setTokenState(t);
      // optionally fetch profile here; for now set minimal user
      setUser(null);
    }
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') {
        const newT = e.newValue;
        setTokenState(newT);
        if (!newT) setUser(null);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const authenticate = useCallback((t: string | null, u?: User) => {
    setToken(t);
    setTokenState(t);
    setUser(u ?? null);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenState(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (credentials: any) => {
      const res = (await authService.login(credentials)) as LoginResponse;
      if (res && res.token) {
        authenticate(res.token, res.id ? { id: String(res.id) } : null);
      }
      return res;
    },
    [authenticate],
  );

  const value = useMemo(
    () => ({ user, token, ready, login, logout, authenticate }),
    [user, token, ready, login, logout, authenticate],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

export default AuthProvider;
