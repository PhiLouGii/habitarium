import React from 'react';
import styles from './StreakCounter.module.css';

interface StreakCounterProps {
  count: number;
  type: 'good' | 'bad';
}

const StreakCounter: React.FC<StreakCounterProps> = ({ count, type }) => {
  const counterClass = type === 'good' 
    ? `${styles.counter} ${styles.counterGood}`
    : `${styles.counter} ${styles.counterBad}`;
  
  const icon = type === 'good' ? '🔥' : '🛡️';
  const title = type === 'good' ? 'Current Streak' : 'Resistance Streak';

  return (
    <div className={counterClass}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.count}>{count} days</div>
      </div>
    </div>
  );
};

export default StreakCounter;