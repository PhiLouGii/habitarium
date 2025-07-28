import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../src/pages/Dashboard';

// Mock react-calendar
jest.mock('react-calendar', () => ({
  __esModule: true,
  default: () => <div>Calendar Mock</div>
}));

test('renders dashboard title', () => {
  render(<Dashboard />);
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
});