import React from 'react';

interface StreakCounterProps {
  count: number;
  type: 'good' | 'bad';
}

const StreakCounter: React.FC<StreakCounterProps> = ({ count, type }) => {
  const config = {
    good: {
      title: 'Current Streak',
      icon: '🔥',
      color: 'text-green-500'
    },
    bad: {
      title: 'Resistance Streak',
      icon: '🛡️',
      color: 'text-blue-500'
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center">
        <span className="text-2xl mr-2">{config[type].icon}</span>
        <div>
          <p className="text-sm text-gray-500">{config[type].title}</p>
          <p className={`text-3xl font-bold ${config[type].color}`}>
            {count} days
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;