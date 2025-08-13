import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { getDatabase, onValue, ref, update } from '@react-native-firebase/database';
import { Authcontext } from '../../context/Authcontext';
import { StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


const NotificationsScreen = () => {
  const { user } = useContext(Authcontext);
  const [notifications, setNotifications] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const app = getApp();
    const db = getDatabase(app);
    const notifRef = ref(db, `notifications/${user.id}`);

    const unsubscribe = onValue(notifRef, (snapshot) => {
      const notifList = [];
      snapshot.forEach((child) => {
        notifList.push({ id: child.key, ...child.val() });
      });
      notifList.sort((a, b) => b.timestamp - a.timestamp);
      setNotifications(notifList);
    });

    return () => unsubscribe();
  }, [user.id]);

  const markAsRead = (notifId) => {
    const app = getApp();
    const db = getDatabase(app);
    update(ref(db, `notifications/${user.id}/${notifId}`), { read: true });
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerText}>Notification</Text>
        </View>

      </LinearGradient>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              item.read ? styles.cardRead : styles.cardUnread
            ]}
            onPress={() => markAsRead(item.id)}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.message, !item.read && styles.unreadText]}>
                  {item.message}
                </Text>
                <Text style={styles.time}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
  },
  headerContainer: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
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
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  card: {
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  cardUnread: {
    borderLeftColor: '#B51396',
    backgroundColor: '#fff5fa',
  },
  cardRead: {
    borderLeftColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  message: {
    fontSize: 15,
    color: '#333',
  },
  unreadText: {
    fontWeight: 'bold',
    color: '#5312A6',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  }

});

export default NotificationsScreen;
