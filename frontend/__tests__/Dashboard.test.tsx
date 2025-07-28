import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../src/pages/Dashboard';

// Mock react-calendar
jest.mock('react-calendar', () => ({
  __esModule: true,
  default: () => <div>Calendar Mock</div>
}));

// Mock AuthContext
jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { uid: 'test-user' },
    loading: false,
    logout: jest.fn(),
  }),
}));

test('renders dashboard title', () => {
  render(<Dashboard />);
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
});