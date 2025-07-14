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
          <span className={styles.dividerText}>or sign in with google</span>
        </div>
        
        <button className={styles.googleButton}>
          Google
        </button>
        
        <p className={styles.switchText}>
          New around here? Join the fun <Link to="/signup" className={styles.link}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;