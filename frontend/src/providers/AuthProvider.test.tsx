import { render, screen, waitFor } from '@testing-library/react';
import { actAsync } from '../utils/testUtils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AuthProvider from './AuthProvider';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';

function Consumer() {
  const a = useAuth();
  return (
    <div>
      <div data-testid="token">{a.token ?? ''}</div>
      <div data-testid="user">{a.user ? a.user.id : ''}</div>
      <div data-testid="ready">{String(a.ready)}</div>
      <button data-testid="do-auth" onClick={() => a.authenticate('tkn', { id: 'u1' })} />
      <button data-testid="do-login" onClick={() => a.login && a.login({ email: 'a' })} />
      <button data-testid="do-logout" onClick={() => a.logout()} />
    </div>
  );
}

describe('AuthProvider', () => {
  let loginSpy: any;

  beforeEach(() => {
    localStorage.clear();
    loginSpy = vi.spyOn(authService, 'login');
  });

  afterEach(() => {
    loginSpy.mockRestore();
    localStorage.clear();
  });

  it('initializes from localStorage token', async () => {
    localStorage.setItem('token', 'from-storage');
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('ready').textContent).toBe('true'));
    expect(screen.getByTestId('token').textContent).toBe('from-storage');
  });

  it('syncs token on storage event', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('ready').textContent).toBe('true'));

    await actAsync(async () => {
      // simulate storage event
      const ev = new StorageEvent('storage', { key: 'token', newValue: 'newtok' } as any);
      window.dispatchEvent(ev);
    });

    await waitFor(() => expect(screen.getByTestId('token').textContent).toBe('newtok'));
  });

  it('login calls authService and updates state/localStorage', async () => {
    loginSpy.mockResolvedValue({ token: 'tok123', id: 'u123' });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('ready').textContent).toBe('true'));

    await actAsync(async () => {
      screen.getByTestId('do-login').click();
    });

    await waitFor(() => expect(loginSpy).toHaveBeenCalledWith({ email: 'a' }));
    await waitFor(() => expect(screen.getByTestId('token').textContent).toBe('tok123'));
    expect(localStorage.getItem('token')).toBe('tok123');
    expect(screen.getByTestId('user').textContent).toBe('u123');
  });

  it('logout clears token and user', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('ready').textContent).toBe('true'));

    // authenticate first
    await actAsync(async () => screen.getByTestId('do-auth').click());
    await waitFor(() => expect(screen.getByTestId('token').textContent).toBe('tkn'));

    await actAsync(async () => screen.getByTestId('do-logout').click());
    await waitFor(() => expect(screen.getByTestId('token').textContent).toBe(''));
    expect(localStorage.getItem('token')).toBeNull();
  });
});
