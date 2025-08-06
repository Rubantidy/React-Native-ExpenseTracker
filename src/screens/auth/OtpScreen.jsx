import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Authcontext } from '../../context/Authcontext';

const OtpScreen = ({ route, setUserRole }) => {
  const [otp, setOtp] = useState('');
  const { login } = useContext(Authcontext);
  const { userData } = route.params;

  const handleVerify = () => {
    if (otp === '123456') {
      login(userData);// Switches navigator based on role
    } else {
      Alert.alert('Invalid OTP', 'Please enter correct OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="6-digit OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify & Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
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
 