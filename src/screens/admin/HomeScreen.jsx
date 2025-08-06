import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import { useNavigation } from '@react-navigation/native';
import AdminHeader from '../../components/admin/AdminHeader';
import { Authcontext } from '../../context/Authcontext';
import { getApp } from '@react-native-firebase/app';
import { getDatabase, onValue, ref } from '@react-native-firebase/database';


const HomeScreen = () => {
  const [counts, setCounts] = useState({ Pending: 0, Approved: 0, Rejected: 0 });
  const [recentActivities, setRecentActivities] = useState([]);

  const { user } = useContext(Authcontext);
  const navigation = useNavigation();

  useEffect(() => {
    const app = getApp();
    const db = getDatabase(app);
    const expenseRef = ref(db, '/expensedetails');

    const unsubscribe = onValue(expenseRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        let pending = 0, approved = 0, rejected = 0;
        let activities = [];

        Object.values(data).forEach(item => {
          if (item.status === 'Pending') pending++;
          else if (item.status === 'Approved') approved++;
          else if (item.status === 'Rejected') rejected++;

          activities.push(item);
        });


        activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latest5 = activities.slice(0, 5);

        setCounts({ Pending: pending, Approved: approved, Rejected: rejected });
        setRecentActivities(latest5);
      } else {
        setCounts({ Pending: 0, Approved: 0, Rejected: 0 });
        setRecentActivities([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short' };
    return date.toLocaleDateString('en-GB', options);
  };


  return (
    <View style={{ flex: 1 }}>
      <AdminHeader />
      <LinearGradient colors={['#6A11CB', '#B91372']} style={styles.header}>
        <Text style={styles.headerTitle}>ADMIN DASHBOARD</Text>
        <TouchableOpacity style={styles.monthSelector}>
          <Text style={styles.monthText}>JUL 2025</Text>
          <Icon name="chevron-down" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.cardRow}>
          <TouchableOpacity onPress={() => navigation.navigate('AdminPending')}>
            <View style={[styles.card, { backgroundColor: '#E0F0FF' }]}>
              <Text style={styles.cardTitle}>Pending</Text>
              <Text style={styles.cardCount}>{counts.Pending}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('AdminApproved')}>
            <View style={[styles.card, { backgroundColor: '#E6F6EC' }]}>
              <Text style={styles.cardTitle}>Approved</Text>
              <Text style={styles.cardCount}>{counts.Approved}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('AdminRejected')}>
            <View style={[styles.card, { backgroundColor: '#FFECEC' }]}>
              <Text style={styles.cardTitle}>Rejected</Text>
              <Text style={styles.cardCount}>{counts.Rejected}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
      </View>

      <FlatList
        data={recentActivities}
        keyExtractor={(item) => item.expenseId}
        renderItem={({ item }) => (
          <View style={styles.activityCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityCategory}>{item.name}</Text>
              <Text style={styles.activityAmount}>₹{item.amount}</Text>
            </View>

            <View style={styles.statusBadge(item.status)}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>

            <Text style={styles.activityDate}>{formatDate(item.date)}</Text>
          </View>
        )}

        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No recent activity yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  monthSelector: {
    backgroundColor: '#A855F7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 12,
    alignItems: 'center',
  },
  monthText: {
    color: '#fff',
    marginRight: 5,
    fontWeight: '600',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#6B7280',
    fontWeight: '600',
  },
  activityItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityName: {
    fontWeight: '600',
    fontSize: 15,
  },
  activityDetails: {
    fontSize: 13,
    color: '#555',
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },

  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  activityCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activityAmount: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  statusBadge: (status) => ({
    backgroundColor:
      status === 'Approved'
        ? '#D1FAE5'
        : status === 'Rejected'
          ? '#FECACA'
          : '#FEF9C3',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  }),
  statusText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },

});

export default HomeScreen;
