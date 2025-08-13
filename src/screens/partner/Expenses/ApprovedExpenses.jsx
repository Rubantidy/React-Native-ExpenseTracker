import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    Platform,
    StyleSheet,
    StatusBar
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { getApp } from '@react-native-firebase/app';
import { getDatabase, onValue, ref } from '@react-native-firebase/database';
import { LoaderContext } from '../../../context/LoaderContext';
import { Authcontext } from '../../../context/Authcontext';

const ApprovedExpenses = () => {
    const navigation = useNavigation();
    const { user } = useContext(Authcontext);
    const { showLoader, hideLoader } = useContext(LoaderContext);

    const [allExpenses, setAllExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [selectedDateFilter, setSelectedDateFilter] = useState('All');
    const [selectedPartner, setSelectedPartner] = useState('My Expenses');
    const [partnerNames, setPartnerNames] = useState([]);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);
    const [pickingStart, setPickingStart] = useState(true);

    useEffect(() => {
        const app = getApp();
        const db = getDatabase(app);
        const expenseRef = ref(db, '/expensedetails');

        showLoader();
        const unsubscribe = onValue(expenseRef, (snapshot) => {
            const data = snapshot.val();
            if (data && user?.id) {
                const formatted = Object.keys(data)
                    .map(key => ({ id: key, ...data[key] }))
                    .filter(item => item.status === 'Approved');

                const uniqueNames = Array.from(
                    new Set(formatted.map(item => item.name))
                ).filter(name => name && name !== user?.name);

                setPartnerNames(uniqueNames);
                setAllExpenses(formatted);
            } else {
                setAllExpenses([]);
                setPartnerNames([]);
            }
            hideLoader();
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        let filtered = allExpenses;
        const now = new Date();

        if (selectedDateFilter === 'This Month') {
            filtered = filtered.filter(item => {
                const d = new Date(item.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
        } else if (selectedDateFilter === 'Custom' && customStartDate && customEndDate) {
            filtered = filtered.filter(item => {
                const d = new Date(item.date);
                return d >= customStartDate && d <= customEndDate;
            });
        }

        if (selectedPartner === 'My Expenses') {
            filtered = filtered.filter(item => item.name === user?.name);
        } else if (selectedPartner !== 'All') {
            filtered = filtered.filter(item => item.name === selectedPartner);
        }

        setFilteredExpenses(filtered);
    }, [selectedDateFilter, selectedPartner, allExpenses, customStartDate, customEndDate]);

    useEffect(() => {
        if (selectedDateFilter === 'Custom') {
            setCustomStartDate(null);
            setCustomEndDate(null);
            setTimeout(() => {
                setPickingStart(true);
                setShowDatePicker(true);
            }, 100);
        }
    }, [selectedDateFilter]);

    const onDateChange = (event, selectedDate) => {
        if (!selectedDate) return;

        if (pickingStart) {
            setCustomStartDate(selectedDate);
            setPickingStart(false);
            setTimeout(() => setShowDatePicker(true), 300);
        } else {
            setCustomEndDate(selectedDate);
            setShowDatePicker(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('ExpenseDetails', { expense: item })}
            style={styles.card}
        >
            <View>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
                {selectedPartner !== 'My Expenses' && (
                    <Text style={styles.name}>By: {item.name}</Text>
                )}
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
                <View style={styles.headerTopRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Approved Status</Text>
                </View>

                <View style={styles.filterRow}>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={selectedDateFilter}
                            onValueChange={(itemValue) => setSelectedDateFilter(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="All" value="All" />
                            <Picker.Item label="This Month" value="This Month" />
                            <Picker.Item label="Custom" value="Custom" />
                        </Picker>
                        {selectedDateFilter === 'Custom' && customStartDate && customEndDate && (
                            <Text style={styles.customDateText}>
                                {customStartDate.toDateString().slice(4)} - {customEndDate.toDateString().slice(4)}
                            </Text>
                        )}

                    </View>

                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={selectedPartner}
                            onValueChange={(itemValue) => setSelectedPartner(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="My Expenses" value="My Expenses" />
                            <Picker.Item label="All" value="All" />
                            {partnerNames.map(name => (
                                <Picker.Item key={name} label={name} value={name} />
                            ))}
                        </Picker>
                    </View>
                </View>
            </LinearGradient>

            <FlatList
                data={filteredExpenses}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 40, color: '#6B7280' }}>
                        No Approved expenses found.
                    </Text>
                }
            />

            {showDatePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
        </View>
    );
};

export default ApprovedExpenses;

const styles = StyleSheet.create({
    bar: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#fff',
    },
    headerContainer: {
        height: 140,
        justifyContent: 'center',
        paddingHorizontal: 15,
        marginBottom: 20,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    pickerWrapper: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 10,
    },

    customDateText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 10,
    },

    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#E5E7EB',
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
    name: {
        fontSize: 12,
        color: '#4B5563',
        marginTop: 2,
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
