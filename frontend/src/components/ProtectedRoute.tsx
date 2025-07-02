import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGuest } from '../context/GuestContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth(); // Add logout to the destructuring
  const navigate = useNavigate();
  const { isGuest } = useGuest();

  // If there's no user, redirect to login
 if (!user && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;