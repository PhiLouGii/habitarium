import styles from './Dashboard.module.css';

const Profile = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Your Profile</h1>
        
        <div className={styles.card}>
          <h2>User Information</h2>
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john@example.com</p>
          <p><strong>Member Since:</strong> January 2025</p>
        </div>
        
        <div className={styles.card}>
          <h2>Statistics</h2>
          <p><strong>Total Good Habits:</strong> 8</p>
          <p><strong>Total Bad Habits Broken:</strong> 3</p>
          <p><strong>Current Streak:</strong> 12 days</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;