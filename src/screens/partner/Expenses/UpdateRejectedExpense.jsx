import React, { useState, useContext, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image,
  Alert, ToastAndroid, StyleSheet, Platform, StatusBar
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Authcontext } from '../../../context/Authcontext';
import { LoaderContext } from '../../../context/LoaderContext';
import { getApp } from '@react-native-firebase/app';
import { getDatabase, onValue, push, ref, set } from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import { sendNotificationToAdmins } from '../../Notification/sendNotification';

const UpdateRejectedExpense = ({ route }) => {
  const { expense } = route.params;
  const { user } = useContext(Authcontext);
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const navigation = useNavigation();

  const [invoice, setInvoice] = useState(expense.invoice || '');
  const [amount, setAmount] = useState(expense.amount || '');
  const [category, setCategory] = useState(expense.category || '');
  const [desc, setDesc] = useState(expense.description || '');
  const [gst, setGst] = useState(expense.gst || '');
  const [date, setDate] = useState(new Date(expense.date));
  const [imageUrl, setImageUrl] = useState(expense.imageUrl || '');
  const [receiptImage, setReceiptImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const app = getApp();
    const db = getDatabase(app);
    const categoryRef = ref(db, '/categories');

    onValue(categoryRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name,
        }));
        setCategories(list);
      }
    });
  }, []);

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (res) => {
      if (!res.didCancel && !res.errorCode) {
        setReceiptImage(res.assets[0]);
      }
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) return;

    const app = getApp();
    const db = getDatabase(app);
    const newRef = push(ref(db, 'categories'));

    set(newRef, { name: newCategoryName })
      .then(() => {
        setCategory(newCategoryName);
        setIsAddingNewCategory(false);
        setNewCategoryName('');
      })
      .catch((err) => console.error(err));
  };

  const handleUpdate = async () => {
    let errors = {};
    if (!amount) errors.amount = 'Amount is required';
    if (!category) errors.category = 'Category is required';
    if (!invoice) errors.invoice = 'Invoice is required';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    showLoader();
    const app = getApp();
    const db = getDatabase(app);

    try {
      let uploadedImageUrl = imageUrl;

      if (receiptImage?.uri) {
        const fileName = `${expense.expenseId}_${Date.now()}.jpg`;
        const storageRef = storage().ref(`receipts/${fileName}`);
        await storageRef.putFile(receiptImage.uri);
        uploadedImageUrl = await storageRef.getDownloadURL();
      }

      const updatedExpense = {
        ...expense,
        invoice,
        amount,
        category,
        description: desc,
        gst,
        date: date.toISOString(),
        imageUrl: uploadedImageUrl,
        status: 'Pending',
        updatedAt: new Date().toISOString(),
      };

      await set(ref(db, `expensedetails/${expense.expenseId}`), updatedExpense);
      await sendNotificationToAdmins(`${expense.name} resubmitted a Rejected expense for approval - ${expense.expenseId}`);

      ToastAndroid.show('Expense Resubmitted for Approval!', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not update expense');
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.screen}>
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
          <Text style={styles.headerText}>Update Rejected Expense</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Form Fields Same as EditExpense */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>INVOICE NO</Text>
          <TextInput value={invoice} onChangeText={setInvoice} style={styles.input} />
          {formErrors.invoice && <Text style={{ color: 'red' }}>{formErrors.invoice}</Text>}
        </View>

        <TouchableOpacity style={styles.inputBox} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.label}>DATE</Text>
          <View style={styles.dateRow}>
            <TextInput value={date.toLocaleDateString()} editable={false} style={[styles.input, { flex: 1 }]} />
            <Icon name="calendar" size={20} color="#800080" />
          </View>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
        )}

        <View style={styles.inputBox}>
          <Text style={styles.label}>AMOUNT</Text>
          <TextInput keyboardType="numeric" value={amount} onChangeText={text => setAmount(text.replace(/[^0-9]/g, ''))} style={styles.input} />
          {formErrors.amount && <Text style={{ color: 'red' }}>{formErrors.amount}</Text>}
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>CATEGORY</Text>
          <Picker
            selectedValue={category}
            onValueChange={(value) => {
              if (value === 'add_new') {
                setIsAddingNewCategory(true);
                setCategory(null);
              } else {
                setIsAddingNewCategory(false);
                setCategory(value);
              }
            }}>
            <Picker.Item label="Select Category" value={null} enabled={false} />
            {categories.map(cat => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
            ))}
            <Picker.Item label="➕ Add New Category" value="add_new" />
          </Picker>
          {formErrors.category && <Text style={{ color: 'red' }}>{formErrors.category}</Text>}
        </View>

        {isAddingNewCategory && (
          <View style={{ marginBottom: 16 }}>
            <TextInput
              placeholder="Enter new category"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              style={styles.input}
            />
            <TouchableOpacity onPress={handleAddNewCategory} style={{ backgroundColor: '#800080', padding: 10, borderRadius: 8, marginTop: 8 }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Save Category</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputBox}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput value={desc} onChangeText={setDesc} style={styles.input} />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>GST</Text>
          <TextInput value={gst} onChangeText={setGst} style={styles.input} />
        </View>

        <View style={[styles.inputBox, { alignItems: 'center' }]}>
          <Text style={styles.label}>ATTACH FILE</Text>
          <TouchableOpacity style={styles.attachmentBox} onPress={handleImagePick}>
            {receiptImage?.uri || imageUrl ? (
              <Image source={{ uri: receiptImage?.uri || imageUrl }} style={{ width: 100, height: 100, borderRadius: 10 }} />
            ) : (
              <Icon name="plus" size={32} color="#888" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Resubmit Expense</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default UpdateRejectedExpense;


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    padding: 16,
    backgroundColor: '#fff',
  },
  inputBox: {
    backgroundColor: '#e6e6e6',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#000',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#c27ba0',
    paddingVertical: 4,
    color: '#333',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentBox: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 12,
    marginTop: 8,
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.48,
    backgroundColor: '#1BA39C',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  attachmentBox: {
    width: 110,
    height: 110,
    borderWidth: 1.2,
    borderColor: '#bbb',
    borderRadius: 10,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  }
});


