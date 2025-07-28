import React from 'react';
import { render, screen, fireEvent, waitFor } from '../src/test-utils';
import Dashboard from '../src/pages/Dashboard';
import test, { describe } from 'node:test';
import { jest } from '@jest/globals';
// Mock Firebase hooks
jest.mock('../src/hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({
    currentUser: { uid: 'test-user' }
  })
}));

jest.mock('../src/hooks/useFirestore', () => ({
  __esModule: true,
  default: () => ({
    getHabits: jest.fn(() => Promise.resolve([
      { id: '1', name: 'Morning Workout', type: 'good', streak: 5 }
    ])),
    addHabit: jest.fn(),
    updateHabit: jest.fn()
  })
}));

describe('Dashboard Component', () => {
  test('renders dashboard title', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Habitarium Dashboard/i)).toBeInTheDocument();
    });
  });

  test('shows existing habits', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Morning Workout')).toBeInTheDocument(); // This line is causing the error
    });
  });

  test('adds new habit', async () => {
    render(<Dashboard />);
    
    // Wait for initial load
    await screen.findByText('Morning Workout');
    
    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Habit name'), {
      target: { value: 'Meditation' }
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'good' }
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Add Habit'));
    
    // Verify new habit appears
    await waitFor(() => {
      expect(screen.getByText('Meditation')).toBeInTheDocument();
    });
  });

  test('marks habit as done', async () => {
    render(<Dashboard />);
    
    // Wait for initial load
    await screen.findByText('Morning Workout');
    
    // Click "Mark as Done"
    const buttons = screen.getAllByText(/Mark as Done/i);
    fireEvent.click(buttons[0]);
    
    // Verify streak updates
    await waitFor(() => {
      expect(screen.getByText(/Streak: 6 days/i)).toBeInTheDocument();
    });
  });

  test('prevents adding empty habit', async () => {
    render(<Dashboard />);
    
    // Wait for initial load
    await screen.findByText('Morning Workout');
    const initialHabits = screen.getAllByText(/Mark as Done/i);
    
    fireEvent.click(screen.getByText('Add Habit'));
    
    // Verify no new habit was added
    await waitFor(() => {
      expect(screen.getAllByText(/Mark as Done/i)).toHaveLength(initialHabits.length);
    });
  });
});

function expect(arg0: any) {
  throw new Error('Function not implemented.');
}
