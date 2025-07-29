import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NoInternetScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Internet Connection</Text>
    </View>
  )
}

export default NoInternetScreen

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff',
  },
  text: {
    fontSize: 18, color: 'red',
  },
});