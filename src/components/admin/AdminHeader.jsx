import { View, Text, Image, StatusBar, Platform, StyleSheet } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminHeader = () => {
  return (
    <View>
      <View style={styles.bar}></View> 
      <View style={styles.div2}>
        <View style={styles.div3}>
          <Image
            source={require('../../assets/tidy_logo.png')}
            style={styles.logo}
          />
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Expense Tracker</Text>
        </View>
        <MaterialCommunityIcons name="bell" size={24} />
      </View>

    </View>
  );
};


export default AdminHeader;

const styles = StyleSheet.create({
  bar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff'
  },

  div2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    paddingRight: 16,
  },
  div3: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    width: 80,
    height: 60,
    marginRight: 20,
    marginLeft: 10,
    resizeMode: 'contain'
  }
})