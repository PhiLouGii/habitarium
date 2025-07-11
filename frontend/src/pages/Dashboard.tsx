import { useState } from 'react';
import styles from './Dashboard.module.css';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type HabitType = 'good' | 'bad';

interface Habit {
  id: string;
  name: string;
  type: HabitType;
  streak: number;
  completions: Date[];
}

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Morning Workout', type: 'good', streak: 5, completions: [] },
    { id: '2', name: 'Read 10 pages', type: 'good', streak: 12, completions: [] },
    { id: '3', name: 'Smoking', type: 'bad', streak: 8, completions: [] },
    { id: '4', name: 'Sugar Binge', type: 'bad', streak: 3, completions: [] },
  ]);
  
  const [newHabit, setNewHabit] = useState({ name: '', type: 'good' as HabitType });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleAddHabit = () => {
    if (newHabit.name.trim() === '') return;
    
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      type: newHabit.type,
      streak: 0,
      completions: []
    };
    
    setHabits([...habits, habit]);
    setNewHabit({ name: '', type: 'good' });
  };

  const handleMarkComplete = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check if already completed today
        const alreadyCompleted = habit.completions.some(d => 
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
        
        if (!alreadyCompleted) {
          const completions = [...habit.completions, today];
          
          // Calculate streak (consecutive days)
          let streak = habit.streak;
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          const hasYesterday = completions.some(d => 
            d.getDate() === yesterday.getDate() &&
            d.getMonth() === yesterday.getMonth() &&
            d.getFullYear() === yesterday.getFullYear()
          );
          
          streak = hasYesterday ? streak + 1 : 1;
          
          return { ...habit, completions, streak };
        }
      }
      return habit;
    }));
  };

  const handleMarkResisted = (habitId: string) => {
    handleMarkComplete(habitId);
  };

  const handleCalendarChange = (value: unknown) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setSelectedDate(value[0]);
    }
    // Null case is ignored (no change)
  };

  const habitsForDate = habits.filter(habit => 
    habit.completions.some(d => 
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    )
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Habitarium Dashboard</h1>
          <div className={styles.userInfo}>
            <nav className={styles.nav}>
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              <NavLink to="/settings">Settings</NavLink>
              <NavLink to="/community">Community</NavLink>
            </nav>
            <Link to="/" className={styles.logoutButton}>Logout</Link>
          </div>
        </div>

        {/* Add Habit Form */}
        <div className={styles.addHabitContainer}>
          <h2 className={styles.sectionTitle}>➕ Add New Habit</h2>
          <div className={styles.addHabitForm}>
            <input
              type="text"
              placeholder="Habit name"
              className={styles.input}
              value={newHabit.name}
              onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
            />
            <select
              className={styles.input}
              value={newHabit.type}
              onChange={(e) => setNewHabit({...newHabit, type: e.target.value as HabitType})}
            >
              <option value="good">Good Habit</option>
              <option value="bad">Bad Habit</option>
            </select>
            <button 
              className={styles.button} 
              onClick={handleAddHabit}
              style={{ marginTop: '10px' }}
            >
              Add Habit
            </button>
          </div>
        </div>

        {/* Calendar Section */}
        <div className={styles.calendarSection}>
          <h2 className={styles.sectionTitle}>📅 Habit Calendar</h2>
          <div className={styles.calendarContainer}>
            <Calendar 
              onChange={handleCalendarChange}
              value={selectedDate} 
              className={styles.calendar}
              tileClassName={({ date }) => {
                const hasHabit = habits.some(habit => 
                  habit.completions.some(d => 
                    d.getDate() === date.getDate() &&
                    d.getMonth() === date.getMonth() &&
                    d.getFullYear() === date.getFullYear()
                  )
                );
                return hasHabit ? styles.highlightedDay : '';
              }}
            />
            
            <div className={styles.dateHabits}>
              <h3>Habits on {selectedDate.toDateString()}</h3>
              {habitsForDate.length > 0 ? (
                <ul className={styles.habitList}>
                  {habitsForDate.map(habit => (
                    <li key={habit.id} className={styles.habitItem}>
                      {habit.type === 'good' ? '✅' : '❌'} {habit.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No habits recorded for this day</p>
              )}
            </div>
          </div>
        </div>

        {/* Habit Panels */}
        <div className={styles.panels}>
          {/* Build Good Habits */}
          <section className={styles.panelGood}>
            <h2 className={styles.sectionTitle}>🔥 Build Good Habits</h2>
            {habits
              .filter(habit => habit.type === 'good')
              .map(habit => (
                <div key={habit.id} className={styles.card}>
                  <p>{habit.name}</p>
                  <p>Streak: <strong>{habit.streak} days</strong></p>
                  <button 
                    className={styles.smallButton}
                    onClick={() => handleMarkComplete(habit.id)}
                  >
                    Mark as Done
                  </button>
                </div>
              ))}
          </section>

          {/* Break Bad Habits */}
          <section className={styles.panelBad}>
            <h2 className={styles.sectionTitle}>🧨 Break Bad Habits</h2>
            {habits
              .filter(habit => habit.type === 'bad')
              .map(habit => (
                <div key={habit.id} className={styles.card}>
                  <p>{habit.name}</p>
                  <p>Resisted: <strong>{habit.streak} days</strong></p>
                  <button 
                    className={styles.smallButton}
                    onClick={() => handleMarkResisted(habit.id)}
                  >
                    Mark as Resisted
                  </button>
                </div>
              ))}
          </section>
        </div>

        {/* Achievements + Suggestions */}
        <div className={styles.bottomSection}>
          <section className={styles.achievements}>
            <h2 className={styles.sectionTitle}>🏆 Achievements</h2>
            <ul className={styles.badgeList}>
              <li className={styles.badge}>🎯 7-Day Streak</li>
              <li className={styles.badge}>🌟 First Habit Added</li>
              <li className={styles.badge}>💯 10 Habits Tracked</li>
            </ul>
          </section>

          <section className={styles.suggestions}>
            <h2 className={styles.sectionTitle}>🔁 Try This Instead</h2>
            <div className={styles.swapCard}>
              <p>Instead of <strong>Smoking</strong>, try <strong>Deep Breathing</strong></p>
            </div>
            <div className={styles.swapCard}>
              <p>Instead of <strong>Sugar Binge</strong>, try <strong>Fruit Smoothie</strong></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;