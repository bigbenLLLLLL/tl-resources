import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../utils/testUtils';
import LandingBody from './LandingBody';

describe('LandingBody', () => {
  it('renders hero content', () => {
    renderWithProviders(<LandingBody />);
    expect(screen.getByRole('heading', { name: /Luma AI/i })).toBeInTheDocument();
  });
});
