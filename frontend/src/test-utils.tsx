import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from './context/AuthContext';
import { FirestoreProvider } from './context/FirestoreContext';

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <FirestoreProvider>
      {children}
    </FirestoreProvider>
  </AuthProvider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };