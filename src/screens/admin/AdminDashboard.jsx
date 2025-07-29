import { View, Text } from 'react-native'
import React from 'react'
import AdminFooter from '../../components/admin/AdminFooter'


const AdminDashboard = () => {
  return ( 
    <View style={{ flex: 1, backgroundColor: '#F6F8FB' }}>
      <AdminFooter />
    </View>
  )
}

export default AdminDashboard;