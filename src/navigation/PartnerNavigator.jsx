import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PartnerDashboard from '../screens/partner/PartnerDashboard';
import PartnersInfo from '../screens/partner/Profile/PartnersInfo';

const Stack = createNativeStackNavigator();
const PartnerNavigator = () => {
  return (
   <Stack.Navigator initialRouteName='PartnerDashboard' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='PartnerDashboard' component={PartnerDashboard} />
      <Stack.Screen name='PartnersInfo' component={PartnersInfo} />
      
    </Stack.Navigator>
  )
}

export default PartnerNavigator

const styles = StyleSheet.create({})