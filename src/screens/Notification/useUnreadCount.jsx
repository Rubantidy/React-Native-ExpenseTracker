import { useEffect, useState } from 'react';
import { getApp } from '@react-native-firebase/app';
import { getDatabase, onValue, ref } from '@react-native-firebase/database';
import { useContext } from 'react';
import { Authcontext } from '../../context/Authcontext';

export const useUnreadCount = () => {
  const { user } = useContext(Authcontext);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    const app = getApp();
    const db = getDatabase(app);
    const notifRef = ref(db, `notifications/${user.id}`);

    const unsubscribe = onValue(notifRef, (snapshot) => {
      let unread = 0;
      snapshot.forEach((child) => {
        if (!child.val().read) unread++;
      });
      setCount(unread);
    });

    return () => unsubscribe();
  }, [user?.id]);

  return count;
};
