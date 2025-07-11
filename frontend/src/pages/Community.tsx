import styles from './Dashboard.module.css';

const Community = () => {
  const users = [
    { name: 'Alex', streak: 42, habits: ['Meditation', 'Running'] },
    { name: 'Sam', streak: 35, habits: ['Reading', 'No Sugar'] },
    { name: 'Taylor', streak: 28, habits: ['Yoga', 'No Smoking'] },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Community</h1>
        
        <div className={styles.card}>
          <h2>Top Streaks</h2>
          <ul className={styles.habitList}>
            {users.map((user, index) => (
              <li key={index} className={styles.habitItem}>
                <strong>{user.name}</strong> - {user.streak} days
                <div>{user.habits.join(', ')}</div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.card}>
          <h2>Join a Challenge</h2>
          <button className={styles.smallButton}>7-Day Meditation</button>
          <button className={styles.smallButton}>30-Day Fitness</button>
          <button className={styles.smallButton}>No Sugar January</button>
        </div>
      </div>
    </div>
  );
};

export default Community;