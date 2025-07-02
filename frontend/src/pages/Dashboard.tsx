import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGuest } from '../context/GuestContext';
import HabitItem from '../components/habits/HabitItem';
import StreakCounter from '../components/habits/StreakCounter';
import styles from './Dashboard.module.css';
import api from '../services/api';

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
  const [habits, setHabits] = useState<{
    goodHabits: Habit[];
    badHabits: Habit[];
  }>({ goodHabits: [], badHabits: [] });
  
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch achievements for both guest and authenticated users
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        name: 'Cristina Yang',
        accomplishment: '100 days of meditation',
        streak: 100,
        avatarColor: '#8A2BE2'
      },
      {
        id: '2',
        name: 'Maya Bishop',
        accomplishment: '3 months smoke-free',
        streak: 90,
        avatarColor: '#20B2AA'
      },
      {
        id: '3',
        name: 'Alex Karev',
        accomplishment: '1 year of daily exercise',
        streak: 365,
        avatarColor: '#FF6347'
      },
      {
        id: '4',
        name: 'Jo Wilson',
        accomplishment: '90 days no alcohol',
        streak: 90,
        avatarColor: '#4682B4'
      },
    ];

    setAchievements(mockAchievements);
    
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

    // Only fetch habits if user is authenticated (not guest)
    if (user && !isGuest) {
      fetchHabits();
    } else {
      setLoading(false);
    }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="text-xl text-teal-700">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className={`${styles.dashboard} min-h-screen bg-gradient-to-br from-blue-50 to-teal-50`}>
      {/* Header */}
      <header className={`${styles.header} bg-white bg-opacity-90 backdrop-blur-sm sticky top-0 z-50 shadow-sm`}>
        <div className="flex justify-between items-center py-4 px-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-teal-800">Habitarium</h1>
            <p className="text-teal-600 text-sm md:text-base mt-1">
              {isGuest ? "Guest View - See what's possible" : `Welcome back, ${user?.name}!`}
            </p>
          </div>
          <button 
            onClick={isGuest ? logoutGuest : logout}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-full text-sm md:text-base hover:from-teal-600 hover:to-teal-800 transition-all shadow-lg"
          >
            {isGuest ? "Exit Guest Mode" : "Logout"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isGuest ? (
          // Guest View
          <>
            <div className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-teal-500 to-blue-500 text-white px-5 py-1 rounded-full mb-4 text-sm font-semibold">
                Inspiration Station
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Real People, <span className="text-teal-600">Remarkable Habits</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                See what our community has accomplished. Join Habitarium today and start your own transformation journey.
              </p>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3"
                        style={{ backgroundColor: achievement.avatarColor }}
                      >
                        {achievement.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{achievement.name}</h3>
                        <p className="text-gray-500 text-sm">Habitarium Member</p>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-teal-500 pl-3 py-1 mb-3">
                      <p className="text-gray-700">{achievement.accomplishment}</p>
                    </div>
                    
                    <div className="flex items-center justify-between bg-teal-50 rounded-lg p-2">
                      <span className="text-gray-600 text-sm font-medium">Current streak:</span>
                      <div className="flex items-center">
                        <span className="text-xl font-bold text-teal-700">{achievement.streak}</span>
                        <span className="ml-1 text-teal-600 text-sm">days</span>
                        <div className="ml-1 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                          <span className="text-teal-600 text-sm">🔥</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA Section */}
            <div className="bg-gradient-to-r from-teal-600 to-blue-700 rounded-2xl p-8 mb-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Transform Your Habits?</h2>
                <p className="text-teal-100 mb-6">
                  Join thousands who've built better routines, broken bad habits, and transformed their lives with Habitarium.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                    <div className="text-2xl text-white mb-2">🌟</div>
                    <h3 className="font-bold text-white mb-1 text-sm">Personalized Tracking</h3>
                  </div>
                  <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                    <div className="text-2xl text-white mb-2">💪</div>
                    <h3 className="font-bold text-white mb-1 text-sm">Daily Motivation</h3>
                  </div>
                  <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                    <div className="text-2xl text-white mb-2">🏆</div>
                    <h3 className="font-bold text-white mb-1 text-sm">Achievement Badges</h3>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    logoutGuest();
                    window.location.href = '/signup';
                  }}
                  className="px-8 py-3 bg-white text-teal-700 font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg text-sm md:text-base"
                >
                  Start Your Journey - It's Free!
                </button>
                
                <p className="mt-4 text-teal-200 text-sm">
                  Join our community of 50,000+ habit builders
                </p>
              </div>
            </div>
          </>
        ) : (
          // Authenticated User View
          <>
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Your Habit Journey</h2>
              <p className="text-gray-600">
                Track your progress and celebrate your milestones
              </p>
            </div>
            
            {/* Streak Counters */}
            <div className="flex flex-wrap gap-6 mb-10">
              <StreakCounter type="good" count={totalGoodStreak} />
              <StreakCounter type="bad" count={totalBadStreak} />
            </div>
            
            {/* Habits Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Good Habits Section */}
              <section className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-teal-700">Build Good Habits</h2>
                  <div className="bg-teal-100 text-teal-800 rounded-full px-3 py-1 font-medium">
                    {habits.goodHabits.length} habits
                  </div>
                </div>
                
                <div className="space-y-4">
                  {habits.goodHabits.map(habit => (
                    <HabitItem
                      key={habit.id}
                      name={habit.name}
                      streak={habit.streak}
                      type="good"
                      onLog={(status) => handleLog(habit.id, status)}
                    />
                  ))}
                  
                  {habits.goodHabits.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="mb-3">You haven't added any good habits yet</p>
                      <button className="px-4 py-2 bg-teal-500 text-white rounded-full text-sm">
                        + Add Good Habit
                      </button>
                    </div>
                  )}
                </div>
              </section>
              
              {/* Bad Habits Section */}
              <section className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-rose-700">Break Bad Habits</h2>
                  <div className="bg-rose-100 text-rose-800 rounded-full px-3 py-1 font-medium">
                    {habits.badHabits.length} habits
                  </div>
                </div>
                
                <div className="space-y-4">
                  {habits.badHabits.map(habit => (
                    <HabitItem
                      key={habit.id}
                      name={habit.name}
                      streak={habit.streak}
                      type="bad"
                      onLog={(status) => handleLog(habit.id, status)}
                    />
                  ))}
                  
                  {habits.badHabits.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="mb-3">You haven't added any bad habits to break</p>
                      <button className="px-4 py-2 bg-rose-500 text-white rounded-full text-sm">
                        + Add Bad Habit
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>
            
            {/* Community Inspiration */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Community Inspiration</h2>
                  <p className="text-gray-600 max-w-2xl">
                    See what others in the Habitarium community are accomplishing
                  </p>
                </div>
                <button className="px-4 py-2 bg-white text-teal-700 border border-teal-300 rounded-full text-sm hover:bg-teal-50 transition">
                  View More
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.slice(0, 2).map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center mb-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3"
                          style={{ backgroundColor: achievement.avatarColor }}
                        >
                          {achievement.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{achievement.name}</h3>
                          <p className="text-gray-500 text-sm">Habitarium Member</p>
                        </div>
                      </div>
                      
                      <div className="border-l-4 border-teal-500 pl-3 py-1 mb-3">
                        <p className="text-gray-700">{achievement.accomplishment}</p>
                      </div>
                      
                      <div className="flex items-center justify-between bg-teal-50 rounded-lg p-2">
                        <span className="text-gray-600 text-sm font-medium">Current streak:</span>
                        <div className="flex items-center">
                          <span className="font-bold text-teal-700">{achievement.streak}</span>
                          <span className="ml-1 text-teal-600 text-sm">days</span>
                          <div className="ml-1 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-600 text-sm">🔥</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 text-center mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm">© {new Date().getFullYear()} Habitarium. All rights reserved.</p>
          <p className="mt-1 text-xs">Your journey to better habits starts with a single step</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;