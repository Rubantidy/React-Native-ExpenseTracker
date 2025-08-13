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
import Bankdetails from '../screens/partner/Profile/Bankdetails';
import EditExpense from '../screens/partner/Expenses/EditExpense';
import UpdateRejectedExpense from '../screens/partner/Expenses/UpdateRejectedExpense';
import { GenerateVoucherPDF } from '../screens/commonScreen/voucherGenerator';
import VoucherPreview from '../screens/commonScreen/VoucherPreview';


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
      <Stack.Screen name='BankForm' component={Bankdetails} />
      <Stack.Screen name='EditExpense' component={EditExpense} />
      <Stack.Screen name='UpdateExpense' component={UpdateRejectedExpense} />
      <Stack.Screen name='GenerateVoucher' component={GenerateVoucherPDF} />
      <Stack.Screen name='VoucherPreview' component={VoucherPreview} />
    </Stack.Navigator>
  ) 
}

export default PartnerNavigator

const styles = StyleSheet.create({}) 