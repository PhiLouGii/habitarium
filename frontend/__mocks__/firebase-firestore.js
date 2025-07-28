export default {
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() => ({
    docs: [{
      id: 'habit-1',
      data: () => ({
        name: 'Morning Workout',
        type: 'good',
        streak: 5
      })
    }]
  })),
};