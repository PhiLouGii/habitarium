/* eslint-disable react-refresh/only-export-components */
import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

interface AllProvidersProps {
  children: ReactNode;
}

const AllProviders = ({ children }: AllProvidersProps) => (
  <MemoryRouter initialEntries={['/']}>
    {children}
  </MemoryRouter>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from testing library
export * from '@testing-library/react';
export { customRender as render };