import { Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PartnerHeader() {
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
         <MaterialCommunityIcons name="bell-badge-outline" size={24} />
         <MaterialCommunityIcons name="history" size={24} />
       </View>
 
     </View>
   );
 };


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