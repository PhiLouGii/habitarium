import styles from './Login.module.css';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome Back!</h1>
      <form className={styles.form}>
        <input type="email" placeholder="Email" className={styles.input} />
        <input type="password" placeholder="Password" className={styles.input} />
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <p className={styles.switchText}>
        New here? <Link to="/Signup" className={styles.link}>Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
