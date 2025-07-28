import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import process from 'process';

// Use Vite's import.meta.env in development, process.env in tests
const firebaseConfig = {
  apiKey: typeof import.meta !== 'undefined' 
    ? import.meta.env.VITE_FIREBASE_API_KEY 
    : process.env.VITE_FIREBASE_API_KEY,
  authDomain: typeof import.meta !== 'undefined' 
    ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN 
    : process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: typeof import.meta !== 'undefined' 
    ? import.meta.env.VITE_FIREBASE_PROJECT_ID 
    : process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: typeof import.meta !== 'undefined' 
    ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET 
    : process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: typeof import.meta !== 'undefined' 
    ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID 
    : process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: typeof import.meta !== 'undefined' 
    ? import.meta.env.VITE_FIREBASE_APP_ID 
    : process.env.VITE_FIREBASE_APP_ID,
  measurementId: typeof import.meta !== 'undefined' 
    ? import.meta.env.VITE_FIREBASE_MEASUREMENT_ID 
    : process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };