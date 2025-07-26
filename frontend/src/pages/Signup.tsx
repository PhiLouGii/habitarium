import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Signup.module.css';
import { FirebaseError } from 'firebase/app';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (loading) return;
  
  try {
    setLoading(true);
    setMessage('');
    
    console.log("Starting signup...");
    const startTime = Date.now();
    
    await signup(formData.email, formData.password, formData.username);
    
    console.log(`Signup completed in ${Date.now() - startTime}ms`);
    navigate('/dashboard');
  } catch (error) {
    console.error("Signup UI error:", error);
    
    if (error instanceof FirebaseError) {
      setMessage(`Error ${error.code}: ${error.message}`);
    } else {
      setMessage('Failed to create account');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Join Habitarium</h1>
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
            placeholder="Password"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
        <p className={styles.switchText}>
          Already have an account? <Link to="/" className={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;