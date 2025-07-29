import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PartnerFooter from '../../components/partner/PartnerFooter'

const PartnerDashboard = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F6F8FB' }}>
      <PartnerFooter />
    </View>
  )
}

export default PartnerDashboard

const styles = StyleSheet.create({})