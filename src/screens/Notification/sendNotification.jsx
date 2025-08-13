import { getApp } from '@react-native-firebase/app';
import { get, getDatabase, push, ref, serverTimestamp } from '@react-native-firebase/database';

export const sendNotification = async (targetUserId, message) => {
  try {
    const app = getApp();
    const db = getDatabase(app);
    const notifRef = ref(db, `notifications/${targetUserId}`);
    await push(notifRef, {
      message,
      read: false,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const sendNotificationToAdmins = async (message) => {
  try {
    const app = getApp();
    const db = getDatabase(app);

    const partnersRef = ref(db, 'partners');
    const snapshot = await get(partnersRef);

    if (snapshot.exists()) {
      const partnersData = snapshot.val();

      for (const partnerId in partnersData) {
        if (partnersData[partnerId].role === 'Admin') {
          const notifRef = ref(db, `notifications/${partnerId}`);
          await push(notifRef, {
            message,
            read: false,
            timestamp: Date.now()
          });
        }
      }
    }
  } catch (error) {
    console.error('Error sending notifications to admins:', error);
  }
};


