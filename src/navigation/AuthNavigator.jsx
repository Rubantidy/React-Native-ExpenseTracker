import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';


const Stack = createNativeStackNavigator(); 

const AuthNavigator = ({ setUserRole }) => {
  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name="Otp">
        {(props) => <OtpScreen {...props} setUserRole={setUserRole} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

export default AuthNavigator