import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ToastAndroid,
  Platform,
  StatusBar,
  ScrollView
} from 'react-native';
import { getDatabase, ref, update, onValue } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import { Authcontext } from '../../context/Authcontext';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const EditProfile = () => {
  const { user, setUser } = useContext(Authcontext);
  const app = getApp();
  const db = getDatabase(app);

  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpVisible, setOtpVisible] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [otpError, setOtpError] = useState('');


  useEffect(() => {
    if (user?.id) {
      const userRef = ref(db, `/partners/${user.id}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setName(data.name || '');
          setEmail(data.email || '');
          setMobile(data.mobile || '');
        }
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!name || !email || !mobile) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      return;
    }

    const updatedData = { name, email, mobile };

    Alert.alert(
      'Confirm Update',
      'Are you sure you want to update your profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: () => {
            console.log('Sending OTP to:', mobile);
            setPendingUpdate(updatedData);
            setOtpVisible(true); 
          },
        },
      ]
    );
  };

  const verifyOtpAndUpdate = async () => {
    if (enteredOtp === '12345') {
      try {
        await update(ref(db, `/partners/${user.id}`), pendingUpdate);

        setUser((prev) => ({
          ...prev,
          ...pendingUpdate,
        }));

        setOtpVisible(false);
        setEnteredOtp('');
        setPendingUpdate(null);
        setOtpError(''); 

        ToastAndroid.show('✅ Profile updated successfully', ToastAndroid.SHORT);
      } catch (error) {
        console.error('Error updating profile:', error);
        setOtpError('Something went wrong. Please try again.');
      }
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  return (
    <ScrollView>
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
          <Text style={styles.headerText}>Edit Profile</Text>
        </View>
      </LinearGradient>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      {/* OTP Modal */}
      <Modal visible={otpVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalDesc}>Enter the OTP sent to your mobile</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={enteredOtp}
              onChangeText={setEnteredOtp}
              keyboardType="numeric"
              maxLength={6}
            />
            {otpError ? <Text style={styles.otpErrorText}>{otpError}</Text> : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => {
                setOtpVisible(false);
                setOtpError('');
                setEnteredOtp('');
              }} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={verifyOtpAndUpdate} style={styles.verifyButton}>
                <Text style={styles.verifyText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default EditProfile;

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
  formContainer: {
    padding: 20,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#8E2DE2',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: '#e7390eff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#8E2DE2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  verifyText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  otpErrorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 13,
  },

});
