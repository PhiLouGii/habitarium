import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Habitarium</h1>
          <p className="text-gray-600">Build good habits, break bad ones</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;