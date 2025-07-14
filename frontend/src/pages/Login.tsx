import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../context/AuthContext'; 
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('Logging in...');

    try {
      await login(email, password);
      setMessage('Login successful! Redirecting...');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      
      if (err instanceof FirebaseError) {
        if (err.code === 'auth/user-not-found') {
          setError('No account found with this email');
        } else if (err.code === 'auth/wrong-password') {
          setError('Incorrect password');
        } else {
          setError('Login failed. Please try again.');
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
        <h1 className={styles.title}>Small steps. Big results.</h1>
        <h2 className={styles.subtitle}>Hello welcome back to your account</h2>
        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        
        <div className={styles.divider}>
        </div>
        
        <button className={styles.googleButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: '8px' }}>
            <path fill="#EA4335" d="M24 9.5c3.2 0 6.2 1.1 8.5 3.3l6.3-6.3C34.6 3.6 29.5 1.5 24 1.5 14.9 1.5 7.3 7.8 4.5 16.1l7.4 5.7c2.2-6.7 8.3-11.3 15.1-11.3z"/>
            <path fill="#4285F4" d="M46.5 24.3c0-1.7-.2-3.4-.6-5H24v9.5h12.7c-.5 2.8-2 5.1-4.3 6.6l7.2 5.6c4.2-3.9 6.6-9.7 6.6-16.7z"/>
            <path fill="#FBBC05" d="M11.9 28.2c-1-2.8-1-5.8 0-8.6L4.5 13.9c-3.2 6.5-3.2 14.3 0 20.8l7.4-6.5z"/>
            <path fill="#34A853" d="M24 46.5c6.4 0 11.8-2.1 15.7-5.6l-7.2-5.6c-2.2 1.5-5 2.4-8.5 2.4-6.8 0-12.8-4.6-15-11.3l-7.4 5.7C7.3 40.2 14.9 46.5 24 46.5z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Sign in with Google
        </button>

        
        <p className={styles.switchText}>
          New around here? Join the fun <Link to="/signup" className={styles.link}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;