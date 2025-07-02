import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard'); // Navigation stays here
    } catch (error) {
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <div className="auth-form">
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary mt-4"
          style={{ maxWidth: '320px' }}
        >
          Login
        </button>
        
        <div className="form-footer mt-6">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="form-link">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;