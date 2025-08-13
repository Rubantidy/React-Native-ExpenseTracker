import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PartnerHome from '../../screens/partner/PartnerHome';
import AddExpense from '../../screens/partner/AddExpense';
import PartnerProfile from '../../screens/partner/Profile/PartnerProfile';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const Tab = createBottomTabNavigator();
const PartnerFooter = () => {
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
        component={PartnerHome}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Add Expense"
        component={AddExpense}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus-box-multiple-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={PartnerProfile}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default PartnerFooter

const styles = StyleSheet.create({})