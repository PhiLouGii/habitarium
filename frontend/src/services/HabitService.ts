import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Habit } from '../models/Habit';

// Add a new habit
export const addHabit = async (habit: Omit<Habit, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'habits'), habit);
    return { ...habit, id: docRef.id };
  } catch (error) {
    console.error('Error adding habit:', error);
    throw error;
  }
};

// Get all habits
export const getHabits = async (userId: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'habits'));
    return querySnapshot.docs
      .filter(doc => doc.data().userId === userId)
      .map(doc => ({ id: doc.id, ...doc.data() } as Habit));
  } catch (error) {
    console.error('Error getting habits:', error);
    throw error;
  }
};

// Update a habit
export const updateHabit = async (id: string, habit: Partial<Habit>) => {
  try {
    await updateDoc(doc(db, 'habits', id), habit);
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
};

// Delete a habit
export const deleteHabit = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'habits', id));
  } catch (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
};