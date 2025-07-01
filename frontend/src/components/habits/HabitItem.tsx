import React from 'react';
import styles from './HabitItem.module.css';
import StreakCounter from './StreakCounter';

interface HabitItemProps {
  name: string;
  streak: number;
  type: 'good' | 'bad';
  onLog: (status: 'done' | 'resisted' | 'slipped') => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ name, streak, type, onLog }) => {
  const logOptions = type === 'good' 
    ? [
        { label: 'Done', status: 'done', className: styles.buttonGood },
        { label: 'Skipped', status: 'slipped', className: styles.buttonNeutral }
      ]
    : [
        { label: 'Resisted', status: 'resisted', className: styles.buttonBad },
        { label: 'Slipped', status: 'slipped', className: styles.buttonNeutral }
      ];

  return (
    <div className={styles.habitItem}>
      <div className={styles.habitHeader}>
        <h3 className={styles.habitName}>{name}</h3>
        <StreakCounter count={streak} type={type} />
      </div>
      
      <div className={styles.actions}>
        {logOptions.map((option) => (
          <button
            key={option.status}
            className={`${styles.actionButton} ${option.className}`}
            onClick={() => onLog(option.status as any)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HabitItem;