import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    role: '',
    favoriteArtists: '',
    software: '',
    city: '',
    experience: '',
    genre: '',
    mood: '',
    availability: '',
    tags: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        bio: userProfile.bio || '',
        role: userProfile.role || '',
        favoriteArtists: userProfile.favoriteArtists || '',
        software: userProfile.software || '',
        city: userProfile.city || '',
        experience: userProfile.experience || '',
        genre: userProfile.genre || '',
        mood: userProfile.mood || '',
        availability: userProfile.availability || '',
        tags: userProfile.tags ? userProfile.tags.join(', ') : '',
      });
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

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
          {!editMode && (
            <button 
              className={styles.editButton}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {userProfile?.displayName?.charAt(0) || 'U'}
          </div>
          <div>
            {editMode ? (
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className={styles.editInput}
              />
            ) : (
              <h2 className={styles.userName}>{userProfile?.displayName}</h2>
            )}
            <div className={styles.premiumBadge}>Premium User</div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Bio & Details</h3>
          
          {editMode ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className={styles.editTextarea}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          ) : (
            <p className={styles.bio}>{userProfile?.bio || 'No bio yet'}</p>
          )}
          
          <div className={styles.detailsGrid}>
            {renderDetailItem('My Role', 'role')}
            {renderDetailItem('My Favorite Artists', 'favoriteArtists')}
            {renderDetailItem('Software/Equipment', 'software')}
            {renderDetailItem('Location', 'city')}
            {renderDetailItem('Experience Level', 'experience')}
            {renderDetailItem('Favorite Music Genre', 'genre')}
            {renderDetailItem('Preferred Mood', 'mood')}
            {renderDetailItem('Availability', 'availability')}
          </div>
        </div>

        <div className={styles.tagsSection}>
          <h4>My Tags:</h4>
          {editMode ? (
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className={styles.editInput}
              placeholder="Enter tags separated by commas"
            />
          ) : (
            <div className={styles.tagsContainer}>
              {userProfile?.tags?.map((tag, index) => (
                <span key={index} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {editMode && (
          <div className={styles.editActions}>
            <button className={styles.cancelButton} onClick={() => setEditMode(false)}>
              Cancel
            </button>
            <button className={styles.saveButton} onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );

  function renderDetailItem(label: string, field: keyof typeof formData) {
    return (
      <div className={styles.detailItem}>
        <span className={styles.detailLabel}>{label}</span>
        {editMode ? (
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className={styles.editInput}
          />
        ) : (
          <span className={styles.detailValue}>
            {userProfile?.[field] || 'Not specified'}
          </span>
        )}
      </div>
    );
  }
};

export default Profile;