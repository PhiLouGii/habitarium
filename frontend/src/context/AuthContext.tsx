import { 
  createContext, 
  useContext, 
  useEffect, 
  useState,
  ReactNode 
} from 'react';
import { 
  User, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateAuthProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FirebaseError } from 'firebase/app';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  bio?: string;
  role?: string;
  favoriteArtists?: string;
  software?: string;
  city?: string;
  experience?: string;
  genre?: string;
  mood?: string;
  availability?: string;
  tags?: string[];
  habits?: Habit[];
}

interface Habit {
  id: string;
  name: string;
  type: 'good' | 'bad';
  streak: number;
  completions: Date[];
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  signup: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Fetch user profile
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);
        
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          // Create new profile
          const newProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            bio: '',
            habits: [],
          };
          
          await setDoc(userDoc, newProfile);
          setUserProfile(newProfile);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string, username: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update auth profile
      await updateAuthProfile(userCredential.user, {
        displayName: username
      });
      
      // Create Firestore profile
      const newProfile: UserProfile = {
        uid: userCredential.user.uid,
        displayName: username,
        email: email,
        bio: '',
        habits: [],
      };
      
      await setDoc(doc(db, "users", userCredential.user.uid), newProfile);
      setUserProfile(newProfile);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        throw error;
      }
      throw new FirebaseError(
        'unknown-error', 
        'An unknown error occurred during signup'
      );
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        throw error;
      }
      throw new FirebaseError(
        'unknown-error', 
        'An unknown error occurred during login'
      );
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
    if (!currentUser || !userProfile) return;
    
    try {
      // Update Firestore
      const userDoc = doc(db, "users", currentUser.uid);
      await updateDoc(userDoc, data);
      
      // Update local state
      setUserProfile({
        ...userProfile,
        ...data
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook for consuming the AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);