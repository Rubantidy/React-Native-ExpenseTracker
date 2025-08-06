import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Button, ScrollView, Image, FlatList } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const Transaction = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('claimed');

  const claimedData = [
    {
      id: '1',
      partner: 'Partner 1',
      amount: '₹500',
      invoiceNo: '18958',
      date: '07 Jun 25',
      expense: 'Foods',
      image: require('../../assets/person2.png'),
    },
    {
      id: '2',
      partner: 'Partner 1',
      amount: '₹500',
      invoiceNo: '18958',
      date: '07 Jun 25',
      expense: 'Foods',
      image: require('../../assets/person2.png'),
    },


  ];

  const toPayData = [
    {
      id: '1',
      partner: 'Partner 2',
      amount: '₹750',
      invoiceNo: '18960',
      date: '08 Jun 25',
      expense: 'Travel',
      image: require('../../assets/person2.png'),
    },
  ];


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
          <Text style={styles.headerText}>Transactions</Text>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              activeTab === 'claimed' ? styles.activeBtn : styles.inactiveBtn,
            ]}
            onPress={() => setActiveTab('claimed')}
          >
            <Text style={activeTab === 'claimed' ? styles.activeText : styles.inactiveText}>
              Claimed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleBtn,
              activeTab === 'topay' ? styles.activeBtn : styles.inactiveBtn,
            ]}
            onPress={() => setActiveTab('topay')}
          >
            <Text style={activeTab === 'topay' ? styles.activeText : styles.inactiveText}>
              To Pay
            </Text>
          </TouchableOpacity>
        </View>


        <View style={styles.contents}>
          <FlatList
            data={activeTab === 'claimed' ? claimedData : toPayData}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.profileContainer}>
                  <View style={styles.profileIcon}>
                    <Image source={item.image} style={styles.iconImage} />
                  </View>
                  <View style={styles.profileDetails}>
                    <Text style={styles.label}><Text style={styles.bold}>Name :</Text> {item.partner}</Text>
                    <Text style={styles.label}><Text style={styles.bold}>Amount :</Text> {item.amount}</Text>
                    <Text style={styles.label}><Text style={styles.bold}>Date :</Text> {item.date}</Text>
                    <Text style={styles.label}><Text style={styles.bold}>Expense :</Text> {item.expense}</Text>
                  </View>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>


      </LinearGradient>
    </View>
  );
};

export default Transaction;

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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 15,
  },
  toggleBtn: {
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeBtn: {
    backgroundColor: '#fff',
  },
  inactiveBtn: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  activeText: {
    color: '#000',
    fontWeight: '600',
  },
  inactiveText: {
    color: '#333',
    fontWeight: '600',
  },
  contents: {
    backgroundColor: "#fff",
    height: 700,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
    paddingTop: 20,

  },

  card: {
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
    borderBottomWidth: 2,
    borderBottomColor: '#B51396',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 80,
    height: 80,

  },
  profileDetails: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  bottomLine: {
    height: 3,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 10,
  },


});