import { Alert, Image, Platform, ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Authcontext } from '../../../context/Authcontext';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PartnerProfile = () => {
  const { user, switchRole } = useContext(Authcontext);
  const navigation = useNavigation();

  const [isEnabled, setIsEnabled] = useState(true);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const { logout } = useContext(Authcontext);
  const { bankDetails } = useContext(Authcontext);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleSwitchBackToAdmin = () => {
    Alert.alert(
      'Confirm Switch',
      'Are you sure you want to switch to Admin?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Switch',
          onPress: async () => {
            if (user.role === 'Admin') {
              await switchRole('Admin');
            } else {
              Alert.alert('Access Denied', 'Only Admins can switch to the Admin dashboard');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };


  // const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <View>
      <View style={styles.bar}></View>
      <LinearGradient
        colors={['#5312A6', '#B51396']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Profile</Text>
        </View>
        <View style={styles.profileSection}>
          <Image
            source={require('../../../assets/person2.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.name}>Acc No: {bankDetails?.accountNumber}</Text>

        </View>


        <ScrollView style={styles.bottomSection}>
          <OptionItem icon="account-edit" label="Edit Profile"  onPress={() => navigation.navigate('PartnerEdit')}/>
          <OptionItem icon="bank-outline" label="Account Details" onPress={() => navigation.navigate('BankForm')}/>
          <OptionItem icon="account-group-outline" label="Partner's Information" onPress={() => navigation.navigate('PartnersInfo')} />
          <OptionItem icon="account-convert" label="Switch Admin" onPress={handleSwitchBackToAdmin} />



          <OptionItem
            icon="bell-ring-outline"
            label="Push Notification"
            onPress={toggleSwitch}
            rightComponent={
              <Switch
                value={isEnabled}
                onValueChange={toggleSwitch}
                trackColor={{ false: '#ccc', true: '#8E2DE2' }}
                thumbColor="#fff"
              />
            }
          />

          <OptionItem
            icon="weather-night"
            label="Dark Theme"
            // onPress={toggleTheme}
            rightComponent={
              <Switch
                // value={isDarkMode}
                // onValueChange={toggleTheme}
                trackColor={{ false: '#ccc', true: '#8E2DE2' }}
                thumbColor="#fff"
              />
            }
          />
          <OptionItem icon="logout" label="Log Out" onPress={handleLogout} />
        </ScrollView>
      </LinearGradient>
    </View>

  )
};
const OptionItem = ({ icon, label, onPress, rightComponent }) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress}>
    <View style={styles.iconLabel}>
      <Icon name={icon} size={24} color="#8E2DE2" />
      <Text style={styles.optionText}>{label}</Text>
    </View>
    {rightComponent || <Icon name="chevron-right" size={30} color="#000" fontWeight={800} />}
  </TouchableOpacity>
);

export default PartnerProfile

const styles = StyleSheet.create({
  bar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff'
  },
  header: {
    marginTop: 30,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 800,
  },
  profileSection: {
    height: 250,
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    height: 95,
    width: 95,
    borderRadius: 40,
    backgroundColor: '#fff',
  },
  name: {
    marginTop: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
    fontWeight: 600,
  },
  bottomSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    height: 479,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderColor: '#f0f0f0',
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#000',
  },
})