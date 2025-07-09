import styles from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
    <div className={styles.container}>
      <h1 className={styles.title}>Habitarium Dashboard</h1>

      <div className={styles.panels}>
        {/* Build Good Habits */}
        <section className={styles.panelGood}>
          <h2 className={styles.sectionTitle}>🔥 Build Good Habits</h2>
          <div className={styles.card}>
            <p>💪 Morning Workout</p>
            <p>Streak: <strong>5 days</strong></p>
          </div>
          <div className={styles.card}>
            <p>📖 Read 10 pages</p>
            <p>Streak: <strong>12 days</strong></p>
          </div>
        </section>

        {/* Break Bad Habits */}
        <section className={styles.panelBad}>
          <h2 className={styles.sectionTitle}>🧨 Break Bad Habits</h2>
          <div className={styles.card}>
            <p>🚬 Smoking</p>
            <p>Resisted: <strong>8 days</strong></p>
          </div>
          <div className={styles.card}>
            <p>🍭 Sugar Binge</p>
            <p>Resisted: <strong>3 days</strong></p>
          </div>
        </section>
      </div>

      {/* Optional: Achievements + Habit Replacements */}
      <div className={styles.bottomSection}>
        <section className={styles.achievements}>
          <h2 className={styles.sectionTitle}>🏆 Achievements</h2>
          <ul className={styles.badgeList}>
            <li className={styles.badge}>🎯 7-Day Streak</li>
            <li className={styles.badge}>🌟 First Login</li>
          </ul>
        </section>

        <section className={styles.suggestions}>
          <h2 className={styles.sectionTitle}>🔁 Try This Instead</h2>
          <div className={styles.swapCard}>
            <p>Instead of <strong>Smoking</strong>, try <strong>Deep Breathing</strong></p>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
