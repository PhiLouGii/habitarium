import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const getInitialPosts = async () => {
  const querySnapshot = await getDocs(collection(db, 'posts'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate(),
    replies: doc.data().replies?.map((r: { timestamp: { toDate: () => unknown; }; }) => ({
      ...r,
      timestamp: r.timestamp.toDate()
    })) || []
  }));
};

export const getInitialUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    followers: doc.data().followers || []
  }));
};