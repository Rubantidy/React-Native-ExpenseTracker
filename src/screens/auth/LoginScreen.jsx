import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getApp } from '@react-native-firebase/app';
import { get, getDatabase, onValue, ref } from '@react-native-firebase/database';

const LoginScreen = () => {
  const [identifier, setIdentifier] = useState('');
  const navigation = useNavigation();

  const handleNext = async () => {
    if (!identifier) {
      Alert.alert('Error', 'Please enter email or mobile number');
      return;
    }

    try {
      const app = getApp();
      const db = getDatabase(app);
      const partnerRef = ref(db, '/partners');

      const snapshot = await get(partnerRef);
      const data = snapshot.val();
      let matchedUser = null;

      if (data) {
        for (const key in data) {
          const user = data[key];
          if (user.email === identifier || user.mobile === identifier) {
            matchedUser = { id: key, ...user };
            break;
          }
        }
      }

      if (matchedUser) {
        navigation.navigate('Otp', { userData: matchedUser });
      } else {
        Alert.alert('Error', 'No user found with that email or mobile');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TidyDS Expense Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Email or Mobile"
        value={identifier}
        onChangeText={setIdentifier}
        keyboardType="default"
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#3A7AFE',
    padding: 15,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
});
