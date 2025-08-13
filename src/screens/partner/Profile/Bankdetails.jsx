import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, StatusBar, ToastAndroid, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { getApp } from '@react-native-firebase/app';
import { getDatabase, onValue, ref, set } from '@react-native-firebase/database';
import { Authcontext } from '../../../context/Authcontext';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { LoaderContext } from '../../../context/LoaderContext';

const Bankdetails = () => {
    const navigation = useNavigation();
    const { user } = useContext(Authcontext);
    const { showLoader, hideLoader } = useContext(LoaderContext);
    const { setBankDetails } = useContext(Authcontext);
    const app = getApp();
    const db = getDatabase(app);

    const [accountHolder, setAccountHolder] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');

    const [errors, setErrors] = useState({});

useEffect(() => {
  if (user?.id) {
    showLoader(); 

    const bankRef = ref(db, `/bankdetails/${user.id}`);
    const unsubscribe = onValue(
      bankRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAccountHolder(data.accountHolder || '');
          setBankName(data.bankName || '');
          setAccountNumber(data.accountNumber || '');
          setConfirmAccountNumber(data.accountNumber || '');
          setIfscCode(data.ifscCode || '');
        }
        hideLoader(); 
      },
      (error) => {
        console.error('Error fetching bank details:', error);
        hideLoader(); 
      }
    );

    return () => unsubscribe(); 
  }
}, [user]);


    const validate = () => {
        const newErrors = {};

        if (!accountHolder.trim()) newErrors.accountHolder = 'Account holder name is required';
        if (!bankName.trim()) newErrors.bankName = 'Bank name is required';

        if (!accountNumber.match(/^\d{9,11}$/))
            newErrors.accountNumber = 'Account number must be 9 to 11 digits';

        if (confirmAccountNumber !== accountNumber)
            newErrors.confirmAccountNumber = 'Account numbers do not match';

        if (!ifscCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/i))
            newErrors.ifscCode = 'Invalid IFSC code format';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        const bankDetails = {
            accountHolder,
            bankName,
            accountNumber,
            ifscCode,
        };

        try {
            showLoader();
            await set(ref(db, `/bankdetails/${user.id}`), bankDetails);
            ToastAndroid.show('✅ Bank details updated successfully', ToastAndroid.SHORT);
            setBankDetails(bankDetails);
        } catch (error) {
            console.error('Error saving bank details:', error);
            ToastAndroid.show('❌ Error saving details', ToastAndroid.SHORT);
        } finally {
            hideLoader();
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
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
                    <Text style={styles.headerText}>Update Bank Details</Text>
                    <View style={styles.iconRight}></View>
                </View>
            </LinearGradient>

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Account Holder Name"
                    placeholderTextColor="#aaa"
                    value={accountHolder}
                    onChangeText={setAccountHolder}
                />
                {errors.accountHolder && <Text style={styles.errorText}>{errors.accountHolder}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Bank Name"
                    placeholderTextColor="#aaa"
                    value={bankName}
                    onChangeText={setBankName}
                />
                {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Account Number"
                    placeholderTextColor="#aaa"
                    value={accountNumber}
                    keyboardType="number-pad"
                    contextMenuHidden={true}
                    secureTextEntry={true}
                    onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, '');
                        setAccountNumber(numericText);
                    }}
                />
                {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Confirm Account Number"
                    placeholderTextColor="#aaa"
                    value={confirmAccountNumber}
                    onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, '');
                        setConfirmAccountNumber(numericText);
                    }}
                    keyboardType="number-pad"
                    contextMenuHidden={true}

                />
                {errors.confirmAccountNumber && (
                    <Text style={styles.errorText}>{errors.confirmAccountNumber}</Text>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="IFSC Code"
                    placeholderTextColor="#aaa"
                    value={ifscCode}
                    onChangeText={setIfscCode}
                    autoCapitalize="characters"
                />
                {errors.ifscCode && <Text style={styles.errorText}>{errors.ifscCode}</Text>}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        Alert.alert(
                            'Confirm Update',
                            'Are you sure you want to Update this bank details?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Yes', onPress: handleSave },
                            ]
                        );
                    }}
                >
                    <Text style={styles.buttonText}>Save Bank Details</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
};

export default Bankdetails;

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
    formContainer: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        fontSize: 16,
        marginTop: 10,
        color: '#000',
    },
    button: {
        backgroundColor: '#5312A6',
        padding: 15,
        marginTop: 20,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        marginLeft: 4,
        fontSize: 13,
    },
});