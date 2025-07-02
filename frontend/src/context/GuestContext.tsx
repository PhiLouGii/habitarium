import { createContext, useContext, useState, ReactNode } from 'react';

interface GuestContextType {
  isGuest: boolean;
  loginAsGuest: () => void;
  logoutGuest: () => void;
}

const GuestContext = createContext<GuestContextType | null>(null);

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};

export const GuestProvider = ({ children }: { children: ReactNode }) => {
  const [isGuest, setIsGuest] = useState(false);

  const loginAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('isGuest', 'true');
  };

  const logoutGuest = () => {
    setIsGuest(false);
    localStorage.removeItem('isGuest');
  };

  return (
    <GuestContext.Provider value={{ isGuest, loginAsGuest, logoutGuest }}>
      {children}
    </GuestContext.Provider>
  );
};