import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const SignupForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true); // Start loading

    // Client-side validation
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('All fields are required');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsSubmitting(false);
      return;
    }
    
    try {
      await signup(name, email, password);
      // Navigation is handled in AuthContext after successful signup
    } catch (error: any) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Signup failed');
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false); // End loading
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
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Enter your full name"
            required
          />
        </div>
        
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
            placeholder="Create a password"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary mt-4"
          style={{ maxWidth: '320px' }}
          disabled={isSubmitting} // Disable during submission
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <div className="form-footer mt-6">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="form-link">Log in</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;