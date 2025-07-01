import React, { useState } from 'react';
import HabitItem from '../components/habits/HabitItem';
import StreakCounter from '../components/habits/StreakCounter';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState({
    goodHabits: [
      { id: 1, name: 'Morning Meditation', streak: 7 },
      { id: 2, name: '30-min Exercise', streak: 3 }
    ],
    badHabits: [
      { id: 3, name: 'No Soda', streak: 5 },
      { id: 4, name: 'No Late-Night Snacking', streak: 2 }
    ]
  });

  const handleLog = (id: number, status: 'done' | 'resisted' | 'slipped') => {
    setHabits(prev => {
      const updatedHabits = { ...prev };
      
      // Find habit in both good and bad arrays
      const allHabits = [...prev.goodHabits, ...prev.badHabits];
      const habit = allHabits.find(h => h.id === id);
      if (!habit) return prev;
      
      // Update streak based on status
      const updatedStreak = 
        (status === 'done' || status === 'resisted') 
          ? habit.streak + 1 
          : 0;
          
      // Update in the correct array
      const habitType = prev.goodHabits.some(h => h.id === id) ? 'goodHabits' : 'badHabits';
      updatedHabits[habitType] = updatedHabits[habitType].map(h => 
        h.id === id ? { ...h, streak: updatedStreak } : h
      );
      
      return updatedHabits;
    });
  };

  const totalGoodStreak = habits.goodHabits.reduce((sum, h) => sum + h.streak, 0);
  const totalBadStreak = habits.badHabits.reduce((sum, h) => sum + h.streak, 0);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Habitarium</h1>
        <p className={styles.subtitle}>Build good habits, break bad ones</p>
      </header>

      <div className={styles.streaksContainer}>
        <StreakCounter type="good" count={totalGoodStreak} />
        <StreakCounter type="bad" count={totalBadStreak} />
      </div>

      <div className={styles.habitsGrid}>
        {/* Good Habits Section */}
        <section className={`${styles.section} ${styles.goodSection}`}>
          <div className={styles.sectionTitle}>
            <h2 className={styles.goodTitle}>Build Good Habits</h2>
            <div className={styles.countBadge}>
              {habits.goodHabits.length}
            </div>
          </div>
          
          <div>
            {habits.goodHabits.map(habit => (
              <HabitItem
                key={habit.id}
                name={habit.name}
                streak={habit.streak}
                type="good"
                onLog={(status) => handleLog(habit.id, status)}
              />
            ))}
          </div>
        </section>

        {/* Bad Habits Section */}
        <section className={`${styles.section} ${styles.badSection}`}>
          <div className={styles.sectionTitle}>
            <h2 className={styles.badTitle}>Break Bad Habits</h2>
            <div className={styles.countBadge}>
              {habits.badHabits.length}
            </div>
          </div>
          
          <div>
            {habits.badHabits.map(habit => (
              <HabitItem
                key={habit.id}
                name={habit.name}
                streak={habit.streak}
                type="bad"
                onLog={(status) => handleLog(habit.id, status)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;