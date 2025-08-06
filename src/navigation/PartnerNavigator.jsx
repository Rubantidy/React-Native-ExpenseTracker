import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PartnerDashboard from '../screens/partner/PartnerDashboard';
import PartnersInfo from '../screens/partner/Profile/PartnersInfo';
import AddPartnerExpense from '../screens/partner/AddPartnerExpense';
import PendingExpenses from '../screens/partner/Expenses/PendingExpenses';
import ApprovedExpenses from '../screens/partner/Expenses/ApprovedExpenses';
import RejectedExpenses from '../screens/partner/Expenses/RejectedExpenses';
import ExpenseDetails from '../screens/partner/Expenses/ExpenseDetails';
import EditProfile from '../screens/commonScreen/EditProfile';

const Stack = createNativeStackNavigator();
const PartnerNavigator = () => {
  return (
   <Stack.Navigator initialRouteName='PartnerDashboard' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='PartnerDashboard' component={PartnerDashboard} />
      <Stack.Screen name='PartnersInfo' component={PartnersInfo} />
      <Stack.Screen name='AddPartnerExpense' component={AddPartnerExpense} />
      <Stack.Screen name='PendingExpense' component={PendingExpenses} />
      <Stack.Screen name='ApprovedExpense' component={ApprovedExpenses} />
      <Stack.Screen name='RejectedExpense' component={RejectedExpenses} />
      <Stack.Screen name='ExpenseDetails' component={ExpenseDetails} />
      <Stack.Screen name='PartnerEdit' component={EditProfile} />
    </Stack.Navigator>
  ) 
}

export default PartnerNavigator

const styles = StyleSheet.create({}) 