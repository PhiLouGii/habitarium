import { useNavigate } from 'react-router-dom';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Settings.module.css';

const Settings = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  // Initialize form state with data from userProfile or empty/defaults
  const [settings, setSettings] = useState({
    username: '',
    email: '',
    role: '',
    favoriteArtists: '',
    equipment: '',
    location: '',
    experienceLevel: '',
    favoriteGenre: '',
    preferredMood: '',
    availability: '',
    notifications: true,
    theme: 'dark',
  });

  // Load userProfile into settings form when it becomes available
  useEffect(() => {
    if (userProfile) {
      setSettings({
        username: userProfile.username || '',
        email: userProfile.email || '',
        role: userProfile.role || '',
        favoriteArtists: (userProfile.favoriteArtists || []).join(', '),
        equipment: userProfile.equipment || '',
        location: userProfile.location || '',
        experienceLevel: userProfile.experienceLevel || '',
        favoriteGenre: userProfile.favoriteGenre || '',
        preferredMood: userProfile.preferredMood || '',
        availability: userProfile.availability || '',
        notifications: userProfile.settings?.notifications ?? true,
        theme: userProfile.settings?.theme || 'dark',
      });
    }
  }, [userProfile]);

  // Handle form input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    // Explicitly cast target to HTMLInputElement to access 'checked' property
    const checked = (target as HTMLInputElement).checked;

    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Form submit handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: call your API or context updater to save `settings`
    console.log('Saving settings:', settings);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
      <div className={styles.header}>
      <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>
      <h1 className={styles.title}>App Settings</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>

          {/* Account Information Section */}
          <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Account Information</h2>
          <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={settings.username}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          {/* Email (disabled) */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={settings.email}
              onChange={handleChange}
              className={styles.input}
              disabled
            />
          </div>

          {/* Role */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="role">
              My Role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              value={settings.role}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., Bedrmaker"
            />
          </div>

          {/* Favorite Artists */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="favoriteArtists">
              My 3 Favorite Artists
            </label>
            <input
              id="favoriteArtists"
              name="favoriteArtists"
              type="text"
              value={settings.favoriteArtists}
              onChange={handleChange}
              className={styles.input}
              placeholder="Separate with commas"
            />
          </div>

          {/* Equipment */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="equipment">
              Software/Equipment
            </label>
            <input
              id="equipment"
              name="equipment"
              type="text"
              value={settings.equipment}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., Ableton"
            />
          </div>

          {/* Location */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="location">
              My City/Region
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={settings.location}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., California, USA"
            />
          </div>

          {/* Experience Level */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="experienceLevel">
              Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={settings.experienceLevel}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          {/* Favorite Genre */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="favoriteGenre">
              Favorite Music Genre
            </label>
            <select
              id="favoriteGenre"
              name="favoriteGenre"
              value={settings.favoriteGenre}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select genre</option>
              <option value="Trap">Trap</option>
              <option value="Hip-Hop">Hip-Hop</option>
              <option value="R&B">R&B</option>
              <option value="Electronic">Electronic</option>
              <option value="Rock">Rock</option>
              <option value="Pop">Pop</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
            </select>
          </div>

          {/* Preferred Mood */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="preferredMood">
              Preferred Mood
            </label>
            <select
              id="preferredMood"
              name="preferredMood"
              value={settings.preferredMood}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select mood</option>
              <option value="Energetic">Energetic</option>
              <option value="Melancholic">Melancholic</option>
              <option value="Relaxed">Relaxed</option>
              <option value="Focused">Focused</option>
              <option value="Creative">Creative</option>
            </select>
          </div>

          {/* Availability */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="availability">
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              value={settings.availability}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select availability</option>
              <option value="Available for Collaboration">Available for Collaboration</option>
              <option value="Busy - Limited Availability">Busy - Limited Availability</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>

          {/* Theme */}
          <div className={styles.formGroup}>
            <label className={styles.label}>App Theme</label>
            <div className={styles.themeOptions}>
              <label className={styles.themeOption}>
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={settings.theme === 'light'}
                  onChange={handleChange}
                />
                <span className={styles.themeLabel}>Light</span>
              </label>
              <label className={styles.themeOption}>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={settings.theme === 'dark'}
                  onChange={handleChange}
                />
                <span className={styles.themeLabel}>Dark</span>
              </label>
              <label className={styles.themeOption}>
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={settings.theme === 'system'}
                  onChange={handleChange}
                />
                <span className={styles.themeLabel}>System</span>
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className={styles.checkbox}
              />
              Enable Notifications
            </label>
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
          <button type="button" className={styles.cancelButton} onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
        </div>
        </div>
        </div>
      </form>
    </div>
    </div>
    </div>
  );
};

export default Settings;
