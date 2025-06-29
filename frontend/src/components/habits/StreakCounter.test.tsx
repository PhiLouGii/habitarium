import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StreakCounter from './StreakCounter';

describe('StreakCounter Component', () => {
  it('displays good habit streak correctly', () => {
    render(<StreakCounter type="good" count={7} />);
    
    expect(screen.getByText('Current Streak')).toBeInTheDocument();
    expect(screen.getByText('7 days')).toBeInTheDocument();
    expect(screen.getByText('🔥')).toBeInTheDocument();
  });

  it('displays bad habit resistance correctly', () => {
    render(<StreakCounter type="bad" count={3} />);
    
    expect(screen.getByText('Resistance Streak')).toBeInTheDocument();
    expect(screen.getByText('3 days')).toBeInTheDocument();
    expect(screen.getByText('🛡️')).toBeInTheDocument();
  });
});