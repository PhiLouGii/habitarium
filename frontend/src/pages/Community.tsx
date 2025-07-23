import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useCommunity from '../context/CommunityContext';
import { useNavigate } from 'react-router-dom';
import Post from '../components/Post';
import CreatePost from './CreatePost';
import styles from './Community.module.css';

const Community = () => {
  useAuth();
  const { posts, users } = useCommunity();
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  // For demo purposes - top community members
  const topMembers = [...users]
    .sort((a, b) => (b.followers?.length || 0) - (a.followers?.length || 0))
    .slice(0, 5);
  const navigate = useNavigate();

  const getInitials = (name?: string) => {
  if (!name || typeof name !== 'string') return '';  // Return empty if name is missing or invalid
  const parts = name.trim().split(' ');
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

  return (
    <div className={styles.container}>
      {/* Back to Dashboard button */}
      <button
        className={styles.backButton}
        onClick={() => navigate('/dashboard')}
        style={{ 
          position: 'fixed', 
          top: 16, 
          left: 16, 
          zIndex: 1000 
        }}
      >
        ← Back to Dashboard
      </button>

      {showCreatePost && <CreatePost onClose={() => setShowCreatePost(false)} />}
      
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Community Forum</h1>
          <button 
            onClick={() => setShowCreatePost(true)}
            className={styles.createButton}
          >
            + Create Post
          </button>
        </div>
        
        <div className={styles.postsContainer}>
          {posts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map(post => (
              <Post key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
      
      <div className={styles.sidebar}>
        <div className={styles.sidebarCard}>
          <h3 className={styles.sidebarTitle}>Top Members</h3>
          <ul className={styles.memberList}>
            {topMembers.map(user => (
              <li key={user.id} className={styles.memberItem}>

                {/* Profile icon with initials */}
                <div className={styles.memberAvatar} title={user.name}>
                  {getInitials(user.name)}
                </div>

                {/* Display username */}
                <div>
                  <p className={styles.memberName}>{user.name}</p>
                  <p className={styles.memberFollowers}>
                    {user.followers?.length || 0} followers
                  </p>
                </div>

                <FollowButton userId={user.id} />
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.sidebarCard}>
          <h3 className={styles.sidebarTitle}>Community Guidelines</h3>
          <ul className={styles.guidelinesList}>
            <li>Be respectful to all members</li>
            <li>Share helpful information</li>
            <li>Keep discussions on-topic</li>
            <li>No spamming or self-promotion</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const FollowButton = ({ userId }: { userId: string }) => {
  const { currentUser, isFollowing, followUser, unfollowUser } = useCommunity();
  
  if (currentUser?.id === userId) return null;
  
  return (
    <button
      onClick={() => isFollowing(userId) ? unfollowUser(userId) : followUser(userId)}
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        isFollowing(userId) 
          ? 'bg-gray-200 text-gray-700' 
          : 'bg-blue-500 text-white'
      }`}
    >
      {isFollowing(userId) ? 'Following' : 'Follow'}
    </button>
  );
};

export default Community;