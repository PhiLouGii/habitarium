import styles from './Signup.module.css';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Join Habitarium</h1>
      <form className={styles.form}>
        <input type="text" placeholder="Username" className={styles.input} />
        <input type="email" placeholder="Email" className={styles.input} />
        <input type="password" placeholder="Password" className={styles.input} />
        <button type="submit" className={styles.button}>Sign Up</button>
      </form>
      <p className={styles.switchText}>
        Already have an account? <Link to="/" className={styles.link}>Login</Link>
      </p>
    </div>
  );
};

export default Signup;
