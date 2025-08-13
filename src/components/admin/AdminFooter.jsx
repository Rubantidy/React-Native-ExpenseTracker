import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../../screens/admin/HomeScreen';
import Transaction from '../../screens/admin/Transaction';
import Profile from '../../screens/admin/Profile/Profile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const AdminFooter = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ec12a4ff',
        tabBarInactiveTintColor: "black",
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, height: 60 + insets.bottom, paddingBottom: insets.bottom, },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Payments"
        component={Transaction}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bank-transfer" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default AdminFooter;