import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Add this import

interface HabitFormProps {
  onSubmit: (habit: any) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ onSubmit }) => {
  const { currentUser } = useAuth(); // Get currentUser from AuthContext
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'good' | 'bad'>('good');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      console.error("User not logged in");
      return;
    }

    onSubmit({
      title,
      description,
      type,
      frequency,
      userId: currentUser.uid,
      createdAt: new Date()
    });

    // Reset form
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Form fields remain the same */}
    </form>
  );
};

export default HabitForm;