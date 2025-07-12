import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Dashboard.module.css';

import { useAuth } from '../context/AuthContext'; 
import { getHabits, addHabit, markHabitComplete } from '../services/HabitService';

// -----------------------------
// Type Definitions
// -----------------------------

type HabitType = 'good' | 'bad';

interface Habit {
  id: string;
  name: string;
  type: HabitType;
  streak: number;
  completions: Date[]; // UTC dates truncated to 00:00
}

// Helper: compare two JS Dates by y/m/d only
const isSameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear();

// -----------------------------
// Component
// -----------------------------

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth(); // Added logout
  const navigate = useNavigate(); // Added navigate

  // All habits for the logged‑in user
  const [habits, setHabits] = useState<Habit[]>([]);

  // Quick‑add form state
  const [newHabit, setNewHabit] = useState<{ name: string; type: HabitType }>({
    name: '',
    type: 'good',
  });

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // -------------------------
  // Effect: load habits once user is available / changes
  // -------------------------
  useEffect(() => {
    if (!currentUser) return;

    const loadHabits = async () => {
      try {
        const userHabits = await getHabits(currentUser.uid);
        setHabits(userHabits);
      } catch (err) {
        console.error('Failed to load habits:', err);
      }
    };

    loadHabits();
  }, [currentUser]);

  // -------------------------
  // Handlers
  // -------------------------

  const handleAddHabit = async () => {
    if (!currentUser) return;
    if (newHabit.name.trim() === '') return;

    try {
      await addHabit(currentUser.uid, {
        name: newHabit.name,
        type: newHabit.type,
        streak: 0,
        completions: [],
      });
      setNewHabit({ name: '', type: 'good' });
      // Refresh
      const updated = await getHabits(currentUser.uid);
      setHabits(updated);
    } catch (err) {
      console.error('Failed to add habit:', err);
    }
  };

  const handleMarkComplete = async (habitId: string) => {
    if (!currentUser) return;
    try {
      await markHabitComplete(currentUser.uid, habitId);
      // Refresh
      const updated = await getHabits(currentUser.uid);
      setHabits(updated);
    } catch (err) {
      console.error('Failed to mark complete:', err);
    }
  };

  const handleCalendarChange = (value: Date | Date[]) => {
    if (Array.isArray(value)) {
      setSelectedDate(value[0]);
    } else {
      setSelectedDate(value);
    }
  };

  const habitsForSelectedDate = habits.filter((h) =>
    h.completions.some((d) => isSameDay(d, selectedDate))
  );

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to login page
  };

  // -------------------------
  // Render
  // -------------------------

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Habitarium Dashboard</h1>
          <nav className={styles.nav}>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/settings">Settings</NavLink>
            <NavLink to="/community">Community</NavLink>
          </nav>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </header>

        {/* ------------------ Add Habit ------------------ */}
        <section className={styles.addHabitContainer}>
          <h2 className={styles.sectionTitle}>➕ Add New Habit</h2>
          <div className={styles.addHabitForm}>
            <input
              type="text"
              placeholder="Habit name"
              className={styles.input}
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            />
            <select
              className={styles.input}
              value={newHabit.type}
              onChange={(e) =>
                setNewHabit({ ...newHabit, type: e.target.value as HabitType })
              }
            >
              <option value="good">Good Habit</option>
              <option value="bad">Bad Habit</option>
            </select>
            <button className={styles.button} onClick={handleAddHabit}>
              Add Habit
            </button>
          </div>
        </section>

        {/* ------------------ Calendar ------------------ */}
        <section className={styles.calendarSection}>
          <h2 className={styles.sectionTitle}>📅 Habit Calendar</h2>
          <div className={styles.calendarContainer}>
            <Calendar 
              onChange={handleCalendarChange}
              value={selectedDate}
              className={styles.calendar}
              tileClassName={({ date }) =>
                habits.some((h) => h.completions.some((d) => isSameDay(d, date)))
                  ? styles.highlightedDay
                  : undefined
              }
            />

            <div className={styles.dateHabits}>
              <h3>Habits on {selectedDate.toDateString()}</h3>
              {habitsForSelectedDate.length ? (
                <ul className={styles.habitList}>
                  {habitsForSelectedDate.map((h) => (
                    <li key={h.id} className={styles.habitItem}>
                      {h.type === 'good' ? '✅' : '❌'} {h.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No habits recorded for this day.</p>
              )}
            </div>
          </div>
        </section>

        {/* ------------------ Panels ------------------ */}
        <div className={styles.panels}>
          {/* Good Habits */}
          <section className={styles.panelGood}>
            <h2 className={styles.sectionTitle}>🔥 Build Good Habits</h2>
            {habits
              .filter((h) => h.type === 'good')
              .map((h) => (
                <div key={h.id} className={styles.card}>
                  <p>{h.name}</p>
                  <p>
                    Streak: <strong>{h.streak} days</strong>
                  </p>
                  <button
                    className={styles.smallButton}
                    onClick={() => handleMarkComplete(h.id)}
                  >
                    Mark as Done
                  </button>
                </div>
              ))}
          </section>

          {/* Bad Habits */}
          <section className={styles.panelBad}>
            <h2 className={styles.sectionTitle}>🧨 Break Bad Habits</h2>
            {habits
              .filter((h) => h.type === 'bad')
              .map((h) => (
                <div key={h.id} className={styles.card}>
                  <p>{h.name}</p>
                  <p>
                    Resisted: <strong>{h.streak} days</strong>
                  </p>
                  <button
                    className={styles.smallButton}
                    onClick={() => handleMarkComplete(h.id)}
                  >
                    Mark as Resisted
                  </button>
                </div>
              ))}
          </section>
        </div>

        {/* ------------------ Achievements & Suggestions ------------------ */}
        <div className={styles.bottomSection}>
          <section className={styles.achievements}>
            <h2 className={styles.sectionTitle}>🏆 Achievements</h2>
            <ul className={styles.badgeList}>
              <li className={styles.badge}>🎯 7‑Day Streak</li>
              <li className={styles.badge}>🌟 First Habit Added</li>
              <li className={styles.badge}>💯 10 Habits Tracked</li>
            </ul>
          </section>

          <section className={styles.suggestions}>
            <h2 className={styles.sectionTitle}>🔁 Try This Instead</h2>
            <div className={styles.swapCard}>
              <p>
                Instead of <strong>Smoking</strong>, try <strong>Deep Breathing</strong>
              </p>
            </div>
            <div className={styles.swapCard}>
              <p>
                Instead of <strong>Sugar Binge</strong>, try <strong>Fruit Smoothie</strong>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;