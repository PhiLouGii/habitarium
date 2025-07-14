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

  // Calculate streaks summary
  const streaksSummary = habits.reduce(
    (acc, habit) => {
      if (habit.type === 'good') {
        acc.totalGood += habit.streak;
        acc.maxGood = Math.max(acc.maxGood, habit.streak);
      } else {
        acc.totalBad += habit.streak;
        acc.maxBad = Math.max(acc.maxBad, habit.streak);
      }
      return acc;
    },
    { totalGood: 0, maxGood: 0, totalBad: 0, maxBad: 0 }
  );

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
    navigate('/login');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <span className={styles.avatarInitial}>
                {userProfile?.displayName?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h1 className={styles.userName}>Habitarium</h1>
              {userProfile && (
              <p className={styles.username}>Let's grow and glow, {userProfile.displayName}!</p>
            )}
              <p className={styles.userStats}>{habits.length} habits tracked</p>
            </div>
          </div>
          <nav className={styles.nav}>
            <NavLink to="/dashboard" className={styles.navLink}>Dashboard</NavLink>
            <NavLink to="/profile" className={styles.navLink}>Profile</NavLink>
            <NavLink to="/settings" className={styles.navLink}>Settings</NavLink>
            <NavLink to="/community" className={styles.navLink}>Community</NavLink>
          </nav>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </header>

        {/* Stats Summary */}
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Total Streaks</h3>
            <p className={styles.statValue}>{streaksSummary.totalGood + streaksSummary.totalBad}</p>
            <div className={styles.statProgress}>
              <div className={styles.progressBar} style={{ width: '75%' }}></div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Good Habits</h3>
            <p className={styles.statValue}>{habits.filter(h => h.type === 'good').length}</p>
            <div className={styles.statProgress}>
              <div className={styles.progressBar} style={{ width: '60%' }}></div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Current Streak</h3>
            <p className={styles.statValue}>{streaksSummary.maxGood} days</p>
            <div className={styles.statProgress}>
              <div className={styles.progressBar} style={{ width: '85%' }}></div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <h3 className={styles.statLabel}>Resisted</h3>
            <p className={styles.statValue}>{streaksSummary.maxBad} days</p>
            <div className={styles.statProgress}>
              <div className={styles.progressBar} style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>

        {/* Habits Grid */}
        <div className={styles.habitsGrid}>
          <div className={styles.habitsColumn}>
            <h2 className={styles.sectionTitle}>🔥 Build Good Habits</h2>
            <div className={styles.habitsList}>
              {habits
                .filter((h) => h.type === 'good')
                .map((h) => (
                  <div key={h.id} className={styles.habitCard}>
                    <div className={styles.habitInfo}>
                      <h3 className={styles.habitName}>{h.name}</h3>
                      <p className={styles.habitStreak}>Streak: {h.streak} days</p>
                    </div>
                    <button
                      className={styles.habitButton}
                      onClick={() => handleMarkComplete(h.id, true)}
                    >
                      Mark Complete
                    </button>
                  </div>
                ))}
            </div>
          </div>
          
          <div className={styles.habitsColumn}>
            <h2 className={styles.sectionTitle}>🧨 Break Bad Habits</h2>
            <div className={styles.habitsList}>
              {habits
                .filter((h) => h.type === 'bad')
                .map((h) => (
                  <div key={h.id} className={styles.habitCard}>
                    <div className={styles.habitInfo}>
                      <h3 className={styles.habitName}>{h.name}</h3>
                      <p className={styles.habitStreak}>Resisted: {h.streak} days</p>
                    </div>
                    <button
                      className={styles.habitButton}
                      onClick={() => handleMarkComplete(h.id, false)}
                    >
                      Mark Resisted
                    </button>
                  </div>
                ))}
            </div>
          </div>
          
          <div className={styles.addHabitCard}>
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
              <button className={styles.addButton} onClick={handleAddHabit}>
                Add Habit
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
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

        {/* Achievements & Suggestions */}
        <div className={styles.bottomSection}>
          <div className={styles.achievementsCard}>
            <h2 className={styles.sectionTitle}>🏆 Achievements</h2>
            <div className={styles.badgeList}>
              <div className={styles.badge}>🎯 7-Day Streak</div>
              <div className={styles.badge}>🌟 First Habit Added</div>
              <div className={styles.badge}>💯 10 Habits Tracked</div>
            </div>
          </div>
          
          <div className={styles.suggestionsCard}>
            <h2 className={styles.sectionTitle}>🔁 Try This Instead</h2>
            <div className={styles.suggestionItem}>
              <p>Instead of <strong>Smoking</strong>, try <strong>Deep Breathing</strong></p>
            </div>
            <div className={styles.suggestionItem}>
              <p>Instead of <strong>Sugar Binge</strong>, try <strong>Fruit Smoothie</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;