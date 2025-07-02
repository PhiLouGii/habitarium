import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGuest } from '../context/GuestContext';
import HabitItem from '../components/habits/HabitItem';
import StreakCounter from '../components/habits/StreakCounter';
import api from '../services/api';
import './Dashboard.css';

interface Habit {
  id: string;
  name: string;
  type: 'good' | 'bad';
  streak: number;
}

interface Achievement {
  id: string;
  name: string;
  accomplishment: string;
  streak: number;
  avatarColor: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isGuest, logoutGuest } = useGuest();
  const [habits, setHabits] = useState<{ goodHabits: Habit[]; badHabits: Habit[] }>({ goodHabits: [], badHabits: [] });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockAchievements: Achievement[] = [
      { 
        id: '1', 
        name: 'Cristina Yang', 
        accomplishment: '90 days in circulation', 
        streak: 906, 
        avatarColor: '#8A2BE2' 
      },
      { 
        id: '2', 
        name: 'Maya Bishop', 
        accomplishment: '3 months smoke-free', 
        streak: 966, 
        avatarColor: '#20B2AA' 
      },
      { 
        id: '3', 
        name: 'Alex Karev', 
        accomplishment: '1 year of daily exercise', 
        streak: 956, 
        avatarColor: '#FF6347' 
      },
      { 
        id: '4', 
        name: 'Jo Wilson', 
        accomplishment: '90 days no alcohol', 
        streak: 6, 
        avatarColor: '#4682B4' 
      },
    ];
    setAchievements(mockAchievements);

    const fetchHabits = async () => {
      try {
        const response = await api.get('/habits');
        setHabits(response.data);
      } catch (error) {
        console.error('Failed to fetch habits', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && !isGuest) fetchHabits();
    else setLoading(false);
  }, [user, isGuest]);

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
      <div className="dashboard-loading">
        <div className="loading-message">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">Habitarium</h1>
            <p className="app-subtitle">
              {isGuest ? "Guest View - See what's possible" : `Welcome back, ${user?.name}!`}
            </p>
          </div>
          <button
            onClick={isGuest ? logoutGuest : logout}
            className="logout-button"
          >
            {isGuest ? 'Exit Guest Mode' : 'Logout'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {isGuest ? (
          <>
            {/* Inspiration Section */}
            <section className="inspiration-section">
              <h1 className="inspiration-title">
                Real People, <span className="highlight">Remarkable Habits</span>
              </h1>
              <p className="inspiration-description">
                See what our community has accomplished. Join Habitarium today and start your own transformation journey.
              </p>
            </section>

            {/* Achievements */}
            <div className="achievements-container">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="achievement-item">
                  <div className="achievement-divider"></div>
                  <div className="achievement-content">
                    <h3 className="achievement-name">{achievement.name}</h3>
                    <p className="achievement-role">Habitarium Member</p>
                    <p className="achievement-accomplishment">{achievement.accomplishment}</p>
                    <div className="achievement-streak">
                      <span>Current streak: </span>
                      <span className="streak-count">{achievement.streak} days</span>
                      <span className="streak-icon">🔥</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="achievement-divider"></div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
              <h2 className="cta-title">Ready to Transform Your Habits?</h2>
              <p className="cta-description">
                Join thousands who've built better routines, broken bad habits, and transformed their lives with Habitarium.
              </p>
              <button
                onClick={() => {
                  logoutGuest();
                  window.location.href = '/signup';
                }}
                className="cta-button"
              >
                Start Your Journey – It's Free!
              </button>
            </div>

            {/* Features */}
            <div className="features-section">
              <h3 className="features-title">Personalized Tracking</h3>
              <ul className="features-list">
                <li className="feature-item">Daily Motivation</li>
                <li className="feature-item">Progress Analytics</li>
                <li className="feature-item">Achievement Badges</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="authenticated-view">
            <div className="journey-header">
              <h2 className="journey-title">Your Habit Journey</h2>
              <p className="journey-subtitle">
                Track your progress and celebrate your milestones
              </p>
            </div>
            
            <div className="streaks-container">
              <StreakCounter type="good" count={totalGoodStreak} />
              <StreakCounter type="bad" count={totalBadStreak} />
            </div>
            
            <div className="habits-grid">
              <section className="habits-section good-habits">
                <div className="section-header">
                  <h2 className="section-title good-title">Build Good Habits</h2>
                  <span className="habit-count">{habits.goodHabits.length} habits</span>
                </div>
                <div className="habits-list">
                  {habits.goodHabits.map(habit => (
                    <HabitItem 
                      key={habit.id} 
                      {...habit} 
                      onLog={(status) => handleLog(habit.id, status)} 
                    />
                  ))}
                  {habits.goodHabits.length === 0 && (
                    <div className="empty-state">
                      <p>You haven't added any good habits yet</p>
                      <button className="add-button good">
                        + Add Good Habit
                      </button>
                    </div>
                  )}
                </div>
              </section>
              
              <section className="habits-section bad-habits">
                <div className="section-header">
                  <h2 className="section-title bad-title">Break Bad Habits</h2>
                  <span className="habit-count">{habits.badHabits.length} habits</span>
                </div>
                <div className="habits-list">
                  {habits.badHabits.map(habit => (
                    <HabitItem 
                      key={habit.id} 
                      {...habit} 
                      onLog={(status) => handleLog(habit.id, status)} 
                    />
                  ))}
                  {habits.badHabits.length === 0 && (
                    <div className="empty-state">
                      <p>You haven't added any bad habits to break</p>
                      <button className="add-button bad">
                        + Add Bad Habit
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>
            
            {/* Community Inspiration */}
            <div className="community-section">
              <div className="community-header">
                <h2 className="community-title">Community Inspiration</h2>
                <p className="community-description">
                  See what others in the Habitarium community are accomplishing
                </p>
              </div>
              
              <div className="community-grid">
                {achievements.slice(0, 2).map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="community-card"
                  >
                    <div className="card-header">
                      <div 
                        className="avatar"
                        style={{ backgroundColor: achievement.avatarColor }}
                      >
                        {achievement.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="card-name">{achievement.name}</h3>
                        <p className="card-role">Habitarium Member</p>
                      </div>
                    </div>
                    <p className="card-accomplishment">{achievement.accomplishment}</p>
                    <div className="card-streak">
                      <span>Current streak: </span>
                      <span className="streak-value">{achievement.streak} days</span>
                      <span className="streak-icon">🔥</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} Habitarium. All rights reserved.</p>
        <p className="footer-sub">Your journey to better habits starts with a single step</p>
      </footer>
    </div>
  );
};

export default Dashboard;