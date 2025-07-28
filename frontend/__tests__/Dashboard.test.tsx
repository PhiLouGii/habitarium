import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../src/pages/Dashboard.tsx';

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
      expect(screen.getByText('Morning Workout')).toBeInTheDocument();
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

  test('highlights days with habits', async () => {
    // Mock today's date
    const mockToday = new Date(2025, 6, 26);
    jest.useFakeTimers().setSystemTime(mockToday);
    
    render(<Dashboard />);
    
    // Wait for initial load
    await screen.findByText('Morning Workout');
    
    // Get today's date element
    const todayElement = screen.getByText(mockToday.getDate().toString());
    
    // Verify it has the highlight class
    expect(todayElement).toHaveClass('highlighted-day');
    
    // Clean up
    jest.useRealTimers();
  });
});