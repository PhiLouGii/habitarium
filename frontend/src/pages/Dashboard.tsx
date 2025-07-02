import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGuest } from '../context/GuestContext';
import HabitItem from '../components/habits/HabitItem';
import StreakCounter from '../components/habits/StreakCounter';
import api from '../services/api';
import styles from './Dashboard.module.css';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EDECDE] to-[#CDE0C9]">
        <div className="text-xl text-[#3c6e78]">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDECDE] to-[#CDE0C9] font-inter">
      {/* Header */}
      <header className="bg-white bg-opacity-90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center py-4 px-6 border-b border-[#CDE0C9]">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#3c6e78]">Habitarium</h1>
            <p className="text-[#68B2A0] text-sm md:text-base mt-1">
              {isGuest ? "Guest View - See what's possible" : `Welcome back, ${user?.name}!`}
            </p>
          </div>
          <button
            onClick={isGuest ? logoutGuest : logout}
            className="px-4 py-2 bg-gradient-to-r from-[#3c6e78] to-[#68B2A0] text-white rounded-full text-sm md:text-base hover:from-[#245c68] hover:to-[#5d9e8d] transition-all shadow-lg"
          >
            {isGuest ? 'Exit Guest Mode' : 'Logout'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {isGuest ? (
          <>
            {/* Inspiration Section */}
            <section className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-[#2D3748] mb-6">
                Real People, <span className="text-[#3c6e78]">Remarkable Habits</span>
              </h1>
              <p className="text-lg text-[#4A5568] max-w-3xl mx-auto mb-8">
                See what our community has accomplished. Join Habitarium today and start your own transformation journey.
              </p>
            </section>

            {/* Achievements */}
            <div className="mb-16">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="mb-8">
                  <div className="border-t border-[#3c6e78] mb-6"></div>
                  <div className="px-4">
                    <h3 className="text-xl font-bold text-[#2D3748]">{achievement.name}</h3>
                    <p className="text-[#68B2A0] text-sm mt-1">Habitarium Member</p>
                    <p className="mt-3 text-[#4A5568]">{achievement.accomplishment}</p>
                    <div className="mt-3 flex items-center">
                      <span className="text-[#4A5568]">Current streak: </span>
                      <span className="ml-2 font-bold text-[#3c6e78]">{achievement.streak} days</span>
                      <span className="ml-2 text-[#FF6347]">🔥</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t border-[#3c6e78]"></div>
            </div>

            {/* CTA Section */}
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748] mb-4">
                Ready to Transform Your Habits?
              </h2>
              <p className="text-lg text-[#4A5568] max-w-3xl mx-auto mb-8">
                Join thousands who've built better routines, broken bad habits, and transformed their lives with Habitarium.
              </p>
              <button
                onClick={() => {
                  logoutGuest();
                  window.location.href = '/signup';
                }}
                className="px-8 py-3 bg-gradient-to-r from-[#3c6e78] to-[#68B2A0] text-white font-bold rounded-full hover:from-[#245c68] hover:to-[#5d9e8d] transition-all shadow-lg"
              >
                Start Your Journey – It's Free!
              </button>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-center text-[#3c6e78] mb-6">
                Personalized Tracking
              </h3>
              <ul className="space-y-4 text-center">
                <li className="text-lg font-medium text-[#2D3748]">Daily Motivation</li>
                <li className="text-lg font-medium text-[#2D3748]">Progress Analytics</li>
                <li className="text-lg font-medium text-[#2D3748]">Achievement Badges</li>
              </ul>
            </div>
          </>
        ) : (
          <div className={styles.dashboard}>
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748] mb-2">Your Habit Journey</h2>
              <p className="text-[#4A5568]">
                Track your progress and celebrate your milestones
              </p>
            </div>
            
            <div className={styles.streaksContainer}>
              <StreakCounter type="good" count={totalGoodStreak} />
              <StreakCounter type="bad" count={totalBadStreak} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <section className={`${styles.section} ${styles.goodSection}`}>
                <div className={styles.sectionTitle}>
                  <h2 className={styles.goodTitle}>Build Good Habits</h2>
                  <span className={styles.countBadge}>{habits.goodHabits.length} habits</span>
                </div>
                <div className="space-y-4">
                  {habits.goodHabits.map(habit => (
                    <HabitItem 
                      key={habit.id} 
                      {...habit} 
                      onLog={(status) => handleLog(habit.id, status)} 
                    />
                  ))}
                  {habits.goodHabits.length === 0 && (
                    <div className="text-center py-8 text-[#4A5568]">
                      <p className="mb-3">You haven't added any good habits yet</p>
                      <button className="px-4 py-2 bg-[#68B2A0] text-white rounded-full text-sm">
                        + Add Good Habit
                      </button>
                    </div>
                  )}
                </div>
              </section>
              
              <section className={`${styles.section} ${styles.badSection}`}>
                <div className={styles.sectionTitle}>
                  <h2 className={styles.badTitle}>Break Bad Habits</h2>
                  <span className={styles.countBadge}>{habits.badHabits.length} habits</span>
                </div>
                <div className="space-y-4">
                  {habits.badHabits.map(habit => (
                    <HabitItem 
                      key={habit.id} 
                      {...habit} 
                      onLog={(status) => handleLog(habit.id, status)} 
                    />
                  ))}
                  {habits.badHabits.length === 0 && (
                    <div className="text-center py-8 text-[#4A5568]">
                      <p className="mb-3">You haven't added any bad habits to break</p>
                      <button className="px-4 py-2 bg-[#E53E3E] text-white rounded-full text-sm">
                        + Add Bad Habit
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>
            
            {/* Community Inspiration */}
            <div className="bg-gradient-to-r from-[#EDECDE] to-[#CDE0C9] rounded-2xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#2D3748] mb-2">Community Inspiration</h2>
                <p className="text-[#4A5568]">
                  See what others in the Habitarium community are accomplishing
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.slice(0, 2).map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="bg-white rounded-2xl shadow-lg p-5"
                  >
                    <div className="flex items-center mb-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3"
                        style={{ backgroundColor: achievement.avatarColor }}
                      >
                        {achievement.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#2D3748]">{achievement.name}</h3>
                        <p className="text-[#68B2A0] text-sm">Habitarium Member</p>
                      </div>
                    </div>
                    <p className="text-[#4A5568] mt-2">{achievement.accomplishment}</p>
                    <div className="mt-3 flex items-center">
                      <span className="text-[#4A5568]">Current streak: </span>
                      <span className="ml-2 font-bold text-[#3c6e78]">{achievement.streak} days</span>
                      <span className="ml-2 text-[#FF6347]">🔥</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-[#3c6e78] text-[#CDE0C9] py-6 text-center">
        <p className="text-sm">© {new Date().getFullYear()} Habitarium. All rights reserved.</p>
        <p className="mt-1 text-xs">Your journey to better habits starts with a single step</p>
      </footer>
    </div>
  );
};

export default Dashboard;