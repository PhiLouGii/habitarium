import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import HabitForm from '../components/habits/HabitForm';
import HabitList from '../components/habits/HabitList';
import StreakCounter from '../components/habits/StreakCounter';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<any>({ goodHabits: [], badHabits: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/habits/dashboard');
        setHabits(response.data);
      } catch (error) {
        console.error('Failed to fetch habits', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <StreakCounter 
          type="good" 
          count={habits.totalGoodStreak || 0} 
        />
        <StreakCounter 
          type="bad" 
          count={habits.totalResistance || 0} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-green-600">
            Build Good Habits
          </h2>
          <HabitForm type="good" />
          <HabitList 
            habits={habits.goodHabits} 
            type="good" 
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">
            Break Bad Habits
          </h2>
          <HabitForm type="bad" />
          <HabitList 
            habits={habits.badHabits} 
            type="bad" 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;