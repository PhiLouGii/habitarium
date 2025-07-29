import { addHabit } from '../services/HabitService';

// When adding a habit:
const handleSubmit = async () => {
  try {
    await addHabit({
      title: 'Exercise',
      description: '30 minutes daily',
      type: 'good',
      frequency: 'daily',
      userId: currentUser.uid,
      createdAt: new Date()
    });
  } catch (error) {
    // Handle error
  }
};