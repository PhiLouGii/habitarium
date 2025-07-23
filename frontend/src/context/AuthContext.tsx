/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase';

// Define UserProfile type
export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  displayName: string;
  createdAt: any;
  lastLoginAt: any;
  habitsTracked: number;
  streaks: Record<string, any>;
  achievements: any[];
  settings: {
    theme: string;
    notifications: boolean;
  };
  // Add additional profile fields
  bio?: string;
  role?: string;
  favoriteArtists?: string[];
  equipment?: string;
  location?: string;
  badges?: string;
  experienceLevel?: string;
  favoriteGenre?: string;
  preferredMood?: string;
  availability?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, username: string) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user's profile with display name
      await firebaseUpdateProfile(user, { displayName: username });
      
      // Create user document in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userData: UserProfile = {
        uid: user.uid,
        username,
        email,
        displayName: username,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        habitsTracked: 0,
        streaks: {},
        achievements: [],
        settings: {
          theme: 'dark',
          notifications: true
        }
      };
      
      await setDoc(userDocRef, userData);
      setUserProfile(userData);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update last login time
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { lastLoginAt: serverTimestamp() });
      
      // Fetch user profile
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, updates);
      
      // Update local profile
      setUserProfile(prev => ({
        ...prev!,
        ...updates
      }));
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user profile
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          console.warn('User profile not found');
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    login,
    signup,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};