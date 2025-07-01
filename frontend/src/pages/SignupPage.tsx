import React from 'react';
import SignupForm from '../components/auth/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="deco-circle deco-1"></div>
      <div className="deco-circle deco-2"></div>
      <div className="deco-circle deco-3"></div>
      
      <div className="auth-container z-10">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Habitarium</h1>
            <p className="auth-subtitle">Start your habit transformation journey</p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;