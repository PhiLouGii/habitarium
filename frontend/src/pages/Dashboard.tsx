import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Dashboard.module.css';
import { useAuth } from '../context/AuthContext';

type HabitType = 'good' | 'bad';

interface Habit {
  id: string;
  name: string;
  type: HabitType;
  streak: number;
  completions: Date[];
}

const isSameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear();

const Dashboard: React.FC = () => {
  const { currentUser, userProfile, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<{ name: string; type: HabitType }>({
    name: '',
    type: 'good',
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (userProfile?.habits) {
      setHabits(userProfile.habits.map((habit: Habit) => {
        return {
          ...habit,
          completions: habit.completions.map((d: string | number | Date) => new Date(d))
        };
      }));
    }
  }, [userProfile]);

  const handleAddHabit = async () => {
    if (!currentUser || !userProfile || newHabit.name.trim() === '') return;

    try {
      const newHabitObj: Habit = {
        id: Date.now().toString(),
        name: newHabit.name.trim(),
        type: newHabit.type,
        streak: 0,
        completions: []
      };
      
      const updatedHabits = [...habits, newHabitObj];
      await updateProfile({ habits: updatedHabits });
      setNewHabit({ name: '', type: 'good' });
    } catch (err) {
      console.error('Failed to add habit:', err);
    }
  };

  const handleMarkComplete = async (habitId: string, isGoodHabit: boolean) => {
    if (!currentUser || !userProfile) return;
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const updatedHabits = habits.map(habit => {
        if (habit.id === habitId) {
          // Check if already completed today
          const alreadyCompleted = habit.completions.some(d => 
            isSameDay(d, today)
          );
          
          if (!alreadyCompleted) {
            const newCompletions = [...habit.completions, today];
            return {
              ...habit,
              streak: isGoodHabit ? habit.streak + 1 : habit.streak,
              completions: newCompletions
            };
          }
        }
        return habit;
      });

      await updateProfile({ habits: updatedHabits });
    } catch (err) {
      console.error('Failed to mark complete:', err);
    }
  };

  const handleCalendarChange = (value: Date | Date[]) => {
    setSelectedDate(Array.isArray(value) ? value[0] : value);
  };

  const habitsForSelectedDate = habits.filter(h =>
    h.completions.some(d => isSameDay(d, selectedDate))
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Habitarium Dashboard</h1>
            {userProfile && (
              <p className={styles.username}>Welcome, {userProfile.displayName}!</p>
            )}
          </div>
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

        <section className={styles.calendarSection}>
          <h2 className={styles.sectionTitle}>📅 Habit Calendar</h2>
          <div className={styles.calendarContainer}>
            <Calendar
              onChange={(value) => handleCalendarChange(value as Date | Date[])}
              value={selectedDate}
              className={styles.calendar}
              tileClassName={({ date }) =>
                habits.some(h => h.completions.some(d => isSameDay(d, date)))
                  ? styles.highlightedDay
                  : undefined
              }
            />

            <div className={styles.dateHabits}>
              <h3>Habits on {selectedDate.toDateString()}</h3>
              {habitsForSelectedDate.length ? (
                <ul className={styles.habitList}>
                  {habitsForSelectedDate.map(h => (
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

        <div className={styles.panels}>
          <section className={styles.panelGood}>
            <h2 className={styles.sectionTitle}>🔥 Build Good Habits</h2>
            {habits
              .filter(h => h.type === 'good')
              .map(h => (
                <div key={h.id} className={styles.card}>
                  <p>{h.name}</p>
                  <p>Streak: <strong>{h.streak} days</strong></p>
                  <button
                    className={styles.smallButton}
                    onClick={() => handleMarkComplete(h.id, true)}
                  >
                    Mark as Done
                  </button>
                </div>
              ))}
          </section>

          <section className={styles.panelBad}>
            <h2 className={styles.sectionTitle}>🧨 Break Bad Habits</h2>
            {habits
              .filter(h => h.type === 'bad')
              .map(h => (
                <div key={h.id} className={styles.card}>
                  <p>{h.name}</p>
                  <p>Resisted: <strong>{h.streak} days</strong></p>
                  <button
                    className={styles.smallButton}
                    onClick={() => handleMarkComplete(h.id, false)}
                  >
                    Mark as Resisted
                  </button>
                </div>
              ))}
          </section>
        </div>

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