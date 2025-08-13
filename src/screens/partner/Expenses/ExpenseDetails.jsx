import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, StatusBar, ToastAndroid, Image, Pressable, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { getApp } from '@react-native-firebase/app';
import { getDatabase, ref, remove } from '@react-native-firebase/database';



const ExpenseDetails = ({ route }) => {
    const { expense } = route.params;
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const handleDelete = () => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this expense?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', onPress: () => {
                        const app = getApp();
                        const db = getDatabase(app);
                        const expenseRef = ref(db, `expensedetails/${expense.expenseId}`);
                        remove(expenseRef)
                            .then(() => {
                                ToastAndroid.show(' ✅Expense delete Successfully', ToastAndroid.SHORT)
                                navigation.goBack()
                            })
                            .catch((error) => {
                                console.error('Error deleting expense:', error);
                                Alert.alert('Error', 'Failed to delete the expense.');
                            });
                    },
                },
            ]
        );
    };

    const handleEdit = () => {
        navigation.navigate('EditExpense', { expense });
    };


    const handleDownload = () => {
        navigation.navigate('VoucherPreview', { expense });
    };


    const handleUpdate = () => {
        navigation.navigate('UpdateExpense', { expense });
    };


    const renderButtons = () => {
        switch (expense.status) {
            case 'Pending':
                return (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'Approved':
                return (
                    <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
                        <Text style={styles.buttonText}>Voucher</Text>
                    </TouchableOpacity>
                );
            case 'Rejected':
                return (
                    <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                        <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };


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
                    <Text style={styles.headerText}>{expense.expenseId}</Text>
                    <View style={styles.iconRight} />
                </View>
            </LinearGradient>

            <View style={styles.container}>
                <Text style={styles.label}>Name: {expense.name}</Text>
                <Text style={styles.label}>Expense Id: {expense.expenseId}</Text>
                <Text style={styles.label}>Invoice: {expense.invoice}</Text>
                <Text style={styles.label}>Amount: ₹{expense.amount}</Text>
                <Text style={styles.label}>Category: {expense.category}</Text>
                <Text style={styles.label}>Date: {formatDate(expense.date)}</Text>
                <Text style={styles.label}>Description: {expense.description || "-"}</Text>
                <Text style={styles.label}>GST: {expense.gst || "-"}</Text>
                <Text style={styles.label}>Status: {expense.status}</Text>

                {expense.imageUrl && (
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Image
                            source={{ uri: expense.imageUrl }}
                            style={styles.receiptThumbnail}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}

                <Modal visible={modalVisible} transparent={true}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeArea} onPress={() => setModalVisible(false)} />
                        <Image
                            source={{ uri: expense.imageUrl }}
                            style={styles.modalImage}
                            resizeMode="contain"
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>


                {renderButtons()}
            </View>
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

    container: {
        flex: 1,
        padding: 20
    },
    label: {
        fontSize: 16,
        marginBottom: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30
    },
    editButton: {
        backgroundColor: '#3B82F6',
        padding: 12,
        borderRadius: 8
    },
    deleteButton: {
        backgroundColor: '#EF4444',
        padding: 12,
        borderRadius: 8
    },
    downloadButton: {
        backgroundColor: '#10B981',
        padding: 14,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    updateButton: {
        backgroundColor: '#F59E0B',
        padding: 14,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '90%',
        height: '70%',
        borderRadius: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    closeArea: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    receiptThumbnail: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },

});

export default ExpenseDetails;
