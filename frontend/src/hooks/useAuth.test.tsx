import { render, screen, waitFor } from '@testing-library/react';
import { actAsync } from '../utils/testUtils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AuthProvider from '../providers/AuthProvider';
import { useAuth } from './useAuth';
import * as authService from '../services/authService';

function TestConsumer() {
  const auth = useAuth();

  return (
    <div>
      <div data-testid="token">{auth.token ?? ''}</div>
      <div data-testid="user">{auth.user ? auth.user.id : ''}</div>
      <div data-testid="ready">{String(auth.ready)}</div>

      <button data-testid="do-auth" onClick={() => auth.authenticate('t', { id: 'u' })} />

      <button data-testid="do-logout" onClick={() => auth.logout()} />

      <button
        data-testid="do-login"
        onClick={async () => {
          if (!auth.login) throw new Error('no login');
          await auth.login({ email: 'a' });
        }}
      />
    </div>
  );
}

describe('useAuth hook', () => {
  let loginSpy: any;

  beforeEach(() => {
    vi.useRealTimers();
    loginSpy = vi.spyOn(authService, 'login');
  });

  afterEach(() => {
    loginSpy.mockRestore();
  });

  it('initializes and exposes ready/token/user', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('ready').textContent).toBe('true'));
    expect(screen.getByTestId('token').textContent).toBe('');
    expect(screen.getByTestId('user').textContent).toBe('');
  });

  it('authenticate updates token and user', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('ready').textContent).toBe('true'));

    await actAsync(async () => {
      screen.getByTestId('do-auth').click();
    });

    await waitFor(() => expect(screen.getByTestId('token').textContent).toBe('t'));
    expect(screen.getByTestId('user').textContent).toBe('u');
  });

  it('login calls authService.login and updates state', async () => {
    loginSpy.mockResolvedValue({ token: 'tok', id: 'u' });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('ready').textContent).toBe('true'));

    await actAsync(async () => {
      screen.getByTestId('do-login').click();
    });

    await waitFor(() => expect(loginSpy).toHaveBeenCalledWith({ email: 'a' }));
    await waitFor(() => expect(screen.getByTestId('token').textContent).toBe('tok'));
    expect(screen.getByTestId('user').textContent).toBe('u');
  });

  it('logout clears token and user', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('ready').textContent).toBe('true'));

    // authenticate first
    await actAsync(async () => {
      screen.getByTestId('do-auth').click();
    });

    await waitFor(() => expect(screen.getByTestId('token').textContent).toBe('t'));

    await actAsync(async () => {
      screen.getByTestId('do-logout').click();
    });

    await waitFor(() => expect(screen.getByTestId('token').textContent).toBe(''));
    expect(screen.getByTestId('user').textContent).toBe('');
  });
});
