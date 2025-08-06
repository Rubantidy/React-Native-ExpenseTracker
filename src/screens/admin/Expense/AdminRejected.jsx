import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar, Platform } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { getApp } from '@react-native-firebase/app';
import { getDatabase, onValue, ref } from '@react-native-firebase/database';
import { Authcontext } from '../../../context/Authcontext';
import { LoaderContext } from '../../../context/LoaderContext';

const AdminRejected = () => {
  const navigation = useNavigation();
  const { user } = useContext(Authcontext);
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  useEffect(() => {
    const app = getApp();
    const db = getDatabase(app);
    const expenseRef = ref(db, '/expensedetails');
    showLoader();

    const unsubscribe = onValue(expenseRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const formatted = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(item =>
            item.status === 'Rejected'

          );

        setPendingExpenses(formatted);
      } else {
        setPendingExpenses([]);
      }
      hideLoader();
    });

    return () => unsubscribe();
  }, [user]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('details', { expense: item })}
      style={styles.card}
    >
      <View>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>₹{item.amount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.bar} />

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
          <Text style={styles.headerText}>Rejected Expense</Text>
          <View style={styles.iconRight} />
        </View>
      </LinearGradient>

      <FlatList
        data={pendingExpenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#6B7280' }}>
            No pending expenses found.
          </Text>
        }
      />
    </View>
  );
};

export default AdminRejected

const styles = StyleSheet.create({
  bar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
  },
  headerContainer: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E5E7EB', // light gray
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginHorizontal: 15,
    marginBottom: 12,
  },

  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  date: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },

  amountContainer: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },

  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },


});