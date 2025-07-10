import React from 'react';
import { render, screen, fireEvent, waitFor } from './test-utils';
import Dashboard from '../src/pages/Dashboard';

describe('Dashboard Component', () => {
  test('renders dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Habitarium Dashboard/i)).toBeInTheDocument();
  });

  test('adds new habit', async () => {
    render(<Dashboard />);
    
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
    
    // Click "Mark as Done" for first good habit
    const buttons = screen.getAllByText(/Mark as Done/i);
    fireEvent.click(buttons[0]);
    
    // Verify streak updates
    await waitFor(() => {
      expect(screen.getByText(/Streak: 6 days/i)).toBeInTheDocument();
    });
  });

  test('shows habits for selected date', async () => {
    render(<Dashboard />);
    
    // Mark a habit as done
    const buttons = screen.getAllByText(/Mark as Done/i);
    fireEvent.click(buttons[0]);
    
    // Verify today's date shows the habit
    const today = new Date();
    await waitFor(() => {
      expect(screen.getByText(`Habits on ${today.toDateString()}`)).toBeInTheDocument();
      expect(screen.getByText(/Morning Workout/)).toBeInTheDocument();
    });
  });

  test('prevents adding empty habit', () => {
    render(<Dashboard />);
    
    const initialHabitCount = screen.getAllByText(/Mark as Done/i).length;
    fireEvent.click(screen.getByText('Add Habit'));
    
    // Verify no new habit was added
    expect(screen.getAllByText(/Mark as Done/i).length).toBe(initialHabitCount);
  });

  test('highlights days with habits', () => {
    render(<Dashboard />);
    
    // We'd need to mock date here for consistent testing
    // This would test that the calendar applies the correct CSS class
  });
});