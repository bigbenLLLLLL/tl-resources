import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, actAsync } from '../../utils/testUtils';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import Hero from './Hero';

describe('Hero', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders title and description and navigates on CTA clicks', async () => {
    renderWithProviders(<Hero />);

    expect(screen.getByRole('heading', { name: /Luma AI/i })).toBeInTheDocument();
    expect(screen.getByText(/Create polished tutorial videos/i)).toBeInTheDocument();

    await actAsync(async () => screen.getByText('Start Building').click());
    expect(mockNavigate).toHaveBeenCalledWith('/login');

    await actAsync(async () => screen.getByText('Try Demo').click());
    expect(mockNavigate).toHaveBeenCalledWith('/demo');
  });
});
