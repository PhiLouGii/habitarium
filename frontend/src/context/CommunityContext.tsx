import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  arrayUnion, 
  arrayRemove, 
  updateDoc, 
  onSnapshot, 
  Timestamp 
} from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  avatar: string;
  followers: string[];
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  likes: string[];
  replies: Reply[];
}

interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
}

interface CommunityContextType {
  posts: Post[];
  users: User[];
  currentUser: { id: string; name: string; avatar: string } | null;
  createPost: (content: string) => Promise<void>;
  createReply: (postId: string, content: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  isFollowing: (userId: string) => boolean;
}

const CommunityContext = createContext<CommunityContextType | null>(null);

export const CommunityProvider = ({ children, currentUser }: { children: ReactNode; currentUser: { id: string; name: string; avatar: string } }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const postsUnsub = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const postsData: Post[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          userAvatar: data.userAvatar,
          content: data.content,
          timestamp: data.timestamp.toDate(),
          likes: data.likes || [],
          replies: data.replies?.map((r: Omit<Reply, 'timestamp'> & { timestamp: Timestamp }) => ({
            ...r,
            timestamp: r.timestamp.toDate() 
          })) || []
        };
      });
      setPosts(postsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    });

    const usersUnsub = onSnapshot(collection(db, 'users'), (snapshot) => { 
      setUsers(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          avatar: data.avatar,
          followers: data.followers || []
        };
      }));
    });

    return () => {
      postsUnsub();
      usersUnsub();
    };
  }, []);

  const createPost = async (content: string) => {
    const newPost = {
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: new Date(),
      likes: [],
      replies: []
    };
    
    await setDoc(doc(collection(db, 'posts')), newPost);
  };

  const createReply = async (postId: string, content: string) => {
    const postRef = doc(db, 'posts', postId);
    const newReply = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: new Date()
    };
    
    await updateDoc(postRef, {
      replies: arrayUnion(newReply)
    });
  };

  const toggleLike = async (postId: string) => {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
      const likes = postDoc.data().likes || [];
      if (likes.includes(currentUser.id)) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.id)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.id)
        });
      }
    }
  };

  const followUser = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    const currentUserRef = doc(db, 'users', currentUser.id);
    
    await updateDoc(userRef, {
      followers: arrayUnion(currentUser.id)
    });
    
    await updateDoc(currentUserRef, {
      following: arrayUnion(userId)
    });
  };

  const unfollowUser = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    const currentUserRef = doc(db, 'users', currentUser.id);
    
    await updateDoc(userRef, {
      followers: arrayRemove(currentUser.id)
    });
    
    await updateDoc(currentUserRef, {
      following: arrayRemove(userId)
    });
  };

  const isFollowing = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.followers?.includes(currentUser.id) || false;
  };

  const value = {
    posts,
    users,
    currentUser,
    createPost,
    createReply,
    toggleLike,
    followUser,
    unfollowUser,
    isFollowing
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export default useCommunity;