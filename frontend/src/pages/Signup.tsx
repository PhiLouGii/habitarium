import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { useAuth } from '../context/AuthContext';
import { FirebaseError } from 'firebase/app';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('Creating your account...');

    try {
      await signup(formData.email, formData.password);
      setMessage('Account created successfully! Redirecting...');
      navigate('/dashboard'); 
    } catch (err) {
      console.error('Signup error:', err);
      
      if (err instanceof FirebaseError) {
        // Friendly error messages
        if (err.code === 'auth/email-already-in-use') {
          setError('This email is already registered. Please login instead.');
        } else if (err.code === 'auth/weak-password') {
          setError('Password should be at least 6 characters');
        } else {
          setError('Failed to create account. Please try again.');
        }
      } else {
        setError('An unexpected error occurred');
      }
      setMessage('');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Join Habitarium</h1>
        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className={styles.input}
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          <button type="submit" className={styles.button}>
            Sign Up
          </button>
        </form>
        
        <p className={styles.switchText}>
          Already have an account? <Link to="/login" className={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;