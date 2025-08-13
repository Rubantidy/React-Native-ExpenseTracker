import { View, Text } from 'react-native'
import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { get, getDatabase, ref } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';

export const Authcontext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('loggedInUser');
        const storedActiveRole = await AsyncStorage.getItem('activeRole');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setActiveRole(storedActiveRole || parsedUser.role);

          // ✅ Fetch bank details after restoring user
          const app = getApp();
          const db = getDatabase(app);
          const bankRef = ref(db, `/bankdetails/${parsedUser.id}`);
          const snapshot = await get(bankRef);

          if (snapshot.exists()) {
            setBankDetails(snapshot.val());
          } else {
            setBankDetails(null);
          }
        }
      } catch (err) {
        console.error('Error loading user', err);
      }
    };

    loadUserData();
  }, []);

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(userData));
      await AsyncStorage.setItem('activeRole', userData.role);
      setUser(userData);
      setActiveRole(userData.role);

      const app = getApp();
      const db = getDatabase(app);
      const bankRef = ref(db, `/bankdetails/${userData.id}`);
      const snapshot = await get(bankRef);

      if (snapshot.exists()) {
        setBankDetails(snapshot.val());
      } else {
        setBankDetails(null); // No bank details yet
      }
    } catch (err) {
      console.error('Login error', err);
    }
  };

  const switchRole = async (role) => {
    await AsyncStorage.setItem('activeRole', role);
    setActiveRole(role);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      await AsyncStorage.removeItem('activeRole');
      setUser(null);
      setActiveRole(null);
      setBankDetails(null); // clear bank details on logout
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  return (
    <Authcontext.Provider
      value={{
        user,
        login,
        logout,
        activeRole,
        switchRole,
        setUser,
        bankDetails,
        setBankDetails,
      }}>
      {children}
    </Authcontext.Provider>
  );
};