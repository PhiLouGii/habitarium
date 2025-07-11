import styles from './Dashboard.module.css';

const Settings = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>App Settings</h1>
        
        <div className={styles.card}>
          <h2>Notification Preferences</h2>
          <label>
            <input type="checkbox" defaultChecked />
            Daily Reminders
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            Streak Alerts
          </label>
          <label>
            <input type="checkbox" />
            Weekly Reports
          </label>
        </div>
        
        <div className={styles.card}>
          <h2>Account Settings</h2>
          <button className={styles.smallButton}>Change Password</button>
          <button className={styles.smallButton}>Update Email</button>
          <button className={styles.smallButton}>Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;