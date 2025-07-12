import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useAuth } from '../context/AuthContext';

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
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Friendly error messages
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else {
        setError('Login failed. Please try again.');
      }
      setMessage('');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome Back!</h1>
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
        
        <p className={styles.switchText}>
          New here? <Link to="/signup" className={styles.link}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;