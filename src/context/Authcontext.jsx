import { View, Text } from 'react-native'
import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const Authcontext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(null); // 👈 add this

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('loggedInUser');
        const storedActiveRole = await AsyncStorage.getItem('activeRole');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setActiveRole(storedActiveRole || JSON.parse(storedUser).role); // default to main role
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
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  return (
    <Authcontext.Provider value={{ user, login, logout, activeRole, switchRole, setUser }}>
      {children}
    </Authcontext.Provider>
  );
}
