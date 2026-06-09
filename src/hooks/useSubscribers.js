import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * useSubscribers
 * Fetches all users from the Firestore `users` collection.
 * Returns a sorted list of subscriber objects.
 *
 * Provides: subscribers, loading, error, refetch
 */
const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, 'users'),
        orderBy('subscribedAt', 'desc')
      );
      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setSubscribers(list);
    } catch (err) {
      console.error('useSubscribers fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return { subscribers, loading, error, refetch: fetchSubscribers };
};

export default useSubscribers;
