import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, actAsync } from '../../utils/testUtils';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import Header from './Header';
import AuthProvider from '../../providers/AuthProvider';

describe('Header', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('shows login/register when logged out and navigates on click', async () => {
    renderWithProviders(
      <AuthProvider>
        <Header />
      </AuthProvider>,
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();

    await actAsync(async () => screen.getByText('Login').click());
    expect(mockNavigate).toHaveBeenCalledWith('/login');

    await actAsync(async () => screen.getByText('Register').click());
    expect(mockNavigate).toHaveBeenCalledWith('/register');

    await actAsync(async () => screen.getByText('Luma AI').click());
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('does not show login/register when logged in', () => {
    localStorage.setItem('token', 'tok123');
    renderWithProviders(
      <AuthProvider>
        <Header />
      </AuthProvider>,
    );

    expect(screen.queryByText('Login')).toBeNull();
    expect(screen.queryByText('Register')).toBeNull();
  });
});
