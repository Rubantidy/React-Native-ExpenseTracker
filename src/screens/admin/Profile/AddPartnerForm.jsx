import { Alert, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import database, { equalTo, get, getDatabase, orderByChild, push, query, ref, set } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';


const AddPartnerForm = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  // const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});



  // const generatePassword = () => {
  //   const length = 8;
  //   const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  //   let password = '';
  //   for (let i = 0; i < length; i++) {
  //     const randomChar = charset.charAt(Math.floor(Math.random() * charset.length));
  //     password += randomChar;
  //   }
  //   return password;
  // };


 const handleAddPartner = async () => {
  let errors = {};

  if (!name.trim()) errors.name = 'Name is required';
  if (!mobile.trim()) errors.mobile = 'Mobile number is required';
  if (!email.trim()) errors.email = 'Email is required';
  else if (mobile.length !== 10) errors.mobile = 'Mobile number must be 10 digits';
  if (!role) errors.role = 'Role is required';

  setFormErrors(errors);

  if (Object.keys(errors).length > 0) return;

  Alert.alert(
    'Confirm Add Partner',
    'Are you sure you want to add this partner?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Add',
        onPress: async () => {
          const newPartner = {
            name,
            mobile,
            email,
            role,
            additionalRole: role === 'Admin' ? 'Partner' : '#',
            createdAt: new Date().toISOString(),
          };

          try {
            const app = getApp();
            const db = getDatabase(app);
            const partnerRef = ref(db, '/partners');

            // Check for email duplication
            const emailQuery = query(partnerRef, orderByChild('email'), equalTo(email));
            const snapshot = await get(emailQuery);
            if (snapshot.exists()) {
              ToastAndroid.show('❌ Email already exists', ToastAndroid.SHORT);
              return;
            }

            // Check for mobile duplication
            const mobileQuery = query(partnerRef, orderByChild('mobile'), equalTo(mobile));
            const snapshot2 = await get(mobileQuery);
            if (snapshot2.exists()) {
              ToastAndroid.show('❌ Mobile Number already exists', ToastAndroid.SHORT);
              return;
            }

            // Push partner
            const newPartnerRef = push(partnerRef);
            await set(newPartnerRef, newPartner);

            // ✅ Create dummy notification for this user
            const dummyMessage =
              role === "Admin"
                ? `Welcome Admin ${name}, you can now manage expenses!`
                : `Welcome Partner ${name}, you can now submit expenses!`;

            const notifRef = push(ref(db, `notifications/${newPartnerRef.key}`));
            await set(notifRef, {
              message: dummyMessage,
              timestamp: Date.now(),
              read: false
            });

            ToastAndroid.show('✅ Partner Added with welcome notification', ToastAndroid.SHORT);
            setName('');
            setMobile('');
            setEmail('');
            setRole('');
            setFormErrors({});
          } catch (err) {
            console.error('Firebase Error:', err);
            ToastAndroid.show('❌ Failed to add partner', ToastAndroid.SHORT);
          }
        },
      },
    ]
  );
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
          <Text style={styles.headerText}>Add Partner</Text>
        </View>

      </LinearGradient>
      <View style={styles.formContainer}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Partner Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />
          {formErrors.name && <Text style={{ color: 'red', fontSize: 12 }}>{formErrors.name}</Text>}
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={mobile}
            onChangeText={(text) => { 
              const numericText = text.replace(/[^0-9]/g, ''); // allow only numbers
              setMobile(numericText);
            }}
            placeholderTextColor="#999"
            maxLength={10}
          />
          {formErrors.mobile && <Text style={{ color: 'red', fontSize: 12 }}>{formErrors.mobile}</Text>}
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#999"
            keyboardType="email-address"
          />
          {formErrors.email && <Text style={{ color: 'red', fontSize: 12 }}>{formErrors.email}</Text>}
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Role</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => {
                // Avoid selecting the dummy option
                if (itemValue !== 'default') setRole(itemValue);
              }}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Select Role" value="default" enabled={false} />
              <Picker.Item label="Partner" value="Partner" />
              <Picker.Item label="Admin" value="Admin" />
            </Picker>
          </View>
          {formErrors.role && <Text style={{ color: 'red', fontSize: 12 }}>{formErrors.role}</Text>}
        </View>

        {/* <Text style={styles.note}>Password was automatically created.</Text> */}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btn} onPress={handleAddPartner}>
            <Text style={styles.btnText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};


export default AddPartnerForm

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
  inputBox: {
    backgroundColor: '#e8e8e8',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: '#222',
    marginBottom: 3,
    fontWeight: 800,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#9333EA',
    fontSize: 14,
    paddingVertical: 5,
    color: '#000',
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#B51396',
  },
  picker: {
    color: '#000',
  },
  note: {
    color: '#666',
    fontSize: 13,
    marginBottom: 30,
    marginLeft: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 0.48,
    backgroundColor: '#1BA39C',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});