import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminHeader from '../components/admin/AdminHeader';
import AdminFooter from '../components/admin/AdminFooter';
import AdminDashboard from '../screens/admin/AdminDashboard';
import PartnerManagement from '../screens/admin/Profile/PartnerManagement';
import AddPartnerForm from '../screens/admin/Profile/AddPartnerForm';
import AdminPending from '../screens/admin/Expense/AdminPending';
import AdminApproved from '../screens/admin/Expense/AdminApproved';
import AdminRejected from '../screens/admin/Expense/AdminRejected';
import AdminExpenseDetails from '../screens/admin/Expense/AdminExpenseDetails';
import EditProfile from '../screens/commonScreen/EditProfile';
import VoucherPreview from '../screens/commonScreen/VoucherPreview';

const Stack = createNativeStackNavigator();
 
export default function AdminNavigator() {
  return (
    <Stack.Navigator initialRouteName='Dashboard' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Dashboard' component={AdminDashboard} />
      <Stack.Screen name='header' component={AdminHeader} />
      <Stack.Screen name='footer' component={AdminFooter} />
      <Stack.Screen name='MangePartner' component={PartnerManagement} />
      <Stack.Screen name='AddPartnerForm' component={AddPartnerForm} />
      <Stack.Screen name='AdminPending' component={AdminPending} />
      <Stack.Screen name='AdminApproved' component={AdminApproved} />
      <Stack.Screen name='AdminRejected' component={AdminRejected} />
      <Stack.Screen name='details' component={AdminExpenseDetails} />
      <Stack.Screen name='AdminEdit' component={EditProfile} />
      <Stack.Screen name='VoucherPreview' component={VoucherPreview} />
      
    </Stack.Navigator>
  );
}