import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Add a new habit
export const addHabit = async (userId, habit) => {
  try {
    const docRef = await addDoc(collection(db, "users", userId, "habits"), {
      ...habit,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding habit: ", e);
    throw e;
  }
};

// Get all habits for a user
export const getHabits = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, "users", userId, "habits"));
    const habits = [];
    querySnapshot.forEach((doc) => {
      habits.push({ id: doc.id, ...doc.data() });
    });
    return habits;
  } catch (e) {
    console.error("Error getting habits: ", e);
    throw e;
  }
};

// Update a habit
export const updateHabit = async (userId, habitId, updates) => {
  try {
    const habitRef = doc(db, "users", userId, "habits", habitId);
    await updateDoc(habitRef, updates);
  } catch (e) {
    console.error("Error updating habit: ", e);
    throw e;
  }
};

// Mark habit as complete
export const markHabitComplete = async (userId, habitId) => {
  try {
    const habitRef = doc(db, "users", userId, "habits", habitId);
    await updateDoc(habitRef, {
      lastCompleted: new Date(),
      streak: admin.firestore.FieldValue.increment(1)
    });
  } catch (e) {
    console.error("Error marking habit complete: ", e);
    throw e;
  }
};