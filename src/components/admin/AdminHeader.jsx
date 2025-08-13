import { View, Text, Image, StatusBar, Platform, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUnreadCount } from '../../screens/Notification/useUnreadCount';
import { useNavigation } from '@react-navigation/native';

const AdminHeader = () => {
  const unreadCount = useUnreadCount();
  const navigation = useNavigation();
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
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <MaterialCommunityIcons name="bell-badge-outline" size={26} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
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
  },
    badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
})