import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GuestProvider } from './context/GuestContext';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));

function App() {
  return (
    <AuthProvider>
      <GuestProvider> {/* Wrap with GuestProvider */}
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </GuestProvider>
    </AuthProvider>
  );
}

export default App;