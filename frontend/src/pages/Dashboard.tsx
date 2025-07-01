import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import HabitItem from '../components/habits/HabitItem';
import StreakCounter from '../components/habits/StreakCounter';
import styles from './Dashboard.module.css';
import api from '../services/api';

// Add interface for Habit
interface Habit {
  id: string;
  name: string;
  type: 'good' | 'bad';
  streak: number;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [habits, setHabits] = useState<{
    goodHabits: Habit[];
    badHabits: Habit[];
  }>({ goodHabits: [], badHabits: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await api.get('/habits');
        setHabits(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch habits', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchHabits();
    }
  }, [user]);

  const handleLog = async (id: string, status: 'done' | 'resisted' | 'slipped') => {
    try {
      const response = await api.post(`/habits/${id}/log`, { status });
      setHabits(response.data);
    } catch (error) {
      console.error('Failed to log habit', error);
    }
  };

  const totalGoodStreak = habits.goodHabits.reduce((sum, h) => sum + h.streak, 0);
  const totalBadStreak = habits.badHabits.reduce((sum, h) => sum + h.streak, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className={styles.title}>Habitarium</h1>
            <p className={styles.subtitle}>Welcome back, {user?.name}!</p>
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
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