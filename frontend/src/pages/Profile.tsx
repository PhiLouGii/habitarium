import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Profile.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  
  // Sample tags - in real app, these would come from userProfile
  const tags = ['#Drill', '#Melancholic', '#Rap-US'];
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
          <h1 className={styles.title}>Profile</h1>
        </div>

        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {userProfile?.username?.slice(0, 2).toUpperCase() || 'MF'}
          </div>
          <div>
            <h2 className={styles.userName}>
              {userProfile?.displayName || 'Maria Fernanda'}
            </h2>
            <div className={styles.premiumBadge}>Premium User</div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Bio & other details</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>My Role</span>
              <span className={styles.detailValue}>
                {userProfile?.role || 'Bedrmaker'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>My 3 Favorite Artists</span>
              <span className={styles.detailValue}>
                {userProfile?.favoriteArtists?.join(', ') || 'Ninho, Travis Scott, Metro Boomin'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>The Software or Equipment I Use</span>
              <span className={styles.detailValue}>
                {userProfile?.equipment || 'Ableton'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>My City or Region</span>
              <span className={styles.detailValue}>
                {userProfile?.location || 'California, USA'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Bodges</span>
              <span className={styles.detailValue}>
                {userProfile?.badges || 'Top Collaborator'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>My Experience Level</span>
              <span className={styles.detailValue}>
                {userProfile?.experienceLevel || 'Intermediate'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>My Favorite Music Genre</span>
              <span className={styles.detailValue}>
                {userProfile?.favoriteGenre || 'Trap'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>My Preferred Music Mood</span>
              <span className={styles.detailValue}>
                {userProfile?.preferredMood || 'Melancholic'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Availability</span>
              <span className={styles.detailValue}>
                {userProfile?.availability || 'Available for Collaboration'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.tagsSection}>
          {tags.map((tag: string, index: number) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Social Media</h3>
          <h4 className={styles.subtitle}>My Productions</h4>
          
          <div className={styles.tableHeader}>
            <span className={styles.headerCell}>Title</span>
            <span className={styles.headerCell}>Timing</span>
            <span className={styles.headerCell}>No. of listenings</span>
            <span className={styles.headerCell}>Actions</span>
          </div>
          
          <div className={styles.tableRow}>
            <span className={styles.cell}>Midnight Dreams</span>
            <span className={styles.cell}>3:45</span>
            <span className={styles.cell}>1,245</span>
            <span className={styles.cell}>
              <button className={styles.actionButton}>Edit</button>
              <button className={styles.actionButton}>Share</button>
            </span>
          </div>
          
          <div className={styles.tableRow}>
            <span className={styles.cell}>Urban Echoes</span>
            <span className={styles.cell}>4:20</span>
            <span className={styles.cell}>892</span>
            <span className={styles.cell}>
              <button className={styles.actionButton}>Edit</button>
              <button className={styles.actionButton}>Share</button>
            </span>
          </div>
          
          <div className={styles.tableRow}>
            <span className={styles.cell}>California Vibes</span>
            <span className={styles.cell}>2:58</span>
            <span className={styles.cell}>2,156</span>
            <span className={styles.cell}>
              <button className={styles.actionButton}>Edit</button>
              <button className={styles.actionButton}>Share</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;