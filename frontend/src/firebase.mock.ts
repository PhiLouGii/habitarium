// Simple mock implementation
export const auth = {
  currentUser: { uid: 'test-user' },
  onAuthStateChanged: jest.fn(),
};

export const db = {
  collection: jest.fn(),
};