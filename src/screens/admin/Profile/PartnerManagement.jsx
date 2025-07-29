import { FlatList, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { getApp } from '@react-native-firebase/app';
import { getDatabase, onValue, ref } from '@react-native-firebase/database';

 
const PartnerCard = ({ partner }) => (
  <View style={styles.card}>
    <View style={styles.left}>
      <View style={styles.avatar}>
        <Image
          source={require('../../../assets/person2.png')}
          style={styles.avatar}
        />
      </View>
    </View>
    <View style={styles.right}>
      <Text style={styles.label}><Text style={styles.title}>Name</Text> : {partner.name}</Text>
      <Text style={styles.label}><Text style={styles.title}>E-mail</Text> : {partner.email}</Text>
      <Text style={styles.label}><Text style={styles.title}>Contact</Text> : {partner.mobile}</Text>
      <Text style={styles.label}><Text style={styles.title}>Role</Text> : {partner.role}</Text>
    </View>
  </View>
);
const PartnerManagement = () => {
  const navigation = useNavigation();
  const [partnerData, setpartnerData] = React.useState([]);


  React.useEffect(() => {
    const app = getApp();
    const db = getDatabase(app);
    const partnerRef = ref(db, '/partners');

    const unsubscribe = onValue(partnerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key, index) => ({
          id: key,
          ...data[key],
        }));
        setpartnerData(formattedData);
      } else {
        setpartnerData([]);
      }
    });
    return () => unsubscribe();
  }, []);
  
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.bar}></View>

      <LinearGradient
        colors={['#5312A6', '#B51396']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Partner's Management</Text>
          <View style={styles.iconRight}>
            <TouchableOpacity onPress={() => navigation.navigate('AddPartnerForm')}>
              <Icon name="account-multiple-plus" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={partnerData}
        kkeyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
        renderItem={({ item }) => <PartnerCard partner={item} />}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

export default PartnerManagement

const styles = StyleSheet.create({
  bar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
  },
  headerContainer: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10,

  },
  iconRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    elevation: 2,
    borderBottomWidth: 2,
    borderBottomColor: '#B51396',
  },
  left: {
    marginRight: 15,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
  },
  right: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    marginVertical: 2,
    color: '#333',
  },
  title: {
    fontWeight: 'bold',
  },
});