import React from 'react';
import { act, render, type RenderResult } from '@testing-library/react';
import AppThemeProvider from '../providers/ThemeProvider';
import { BrowserRouter } from 'react-router-dom';

export async function actAsync<T>(fn: () => Promise<T>): Promise<T> {
  let result: T;
  await act(async () => {
    result = await fn();
  });
  return result!;
}

export async function executeAndWait<T>(execute: () => Promise<T>): Promise<T> {
  return actAsync(() => execute());
}

export function attachNoopCatch(p: Promise<any>) {
  p.catch(() => {});
}

export function renderWithProviders(ui: React.ReactElement): RenderResult {
  return render(
    <AppThemeProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </AppThemeProvider>,
  );
}

export default { actAsync, executeAndWait, attachNoopCatch, renderWithProviders };
