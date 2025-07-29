import { View, Text } from 'react-native'
import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const Authcontext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('loggedInUser');
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error loading user', err);
      }
    };

    loadUserData();
  }, []);

   const login = async (userData) => {
    try {
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.error('Login error', err);
    }
  };

   const logout = async () => {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      setUser(null);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

    return (
    <Authcontext.Provider value={{ user, login, logout }}>
      {children}
    </Authcontext.Provider>
  );
}
