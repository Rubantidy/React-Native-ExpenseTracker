import React, { use, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ScrollView,
  PermissionsAndroid,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Authcontext } from '../../context/Authcontext';
import { getApp } from '@react-native-firebase/app';
import { get, getDatabase, onValue, push, ref, set } from '@react-native-firebase/database';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import  storage  from '@react-native-firebase/storage';
import { LoaderContext } from '../../context/LoaderContext';


const AddExpense = () => {
  const navigation = useNavigation();
  const { user } = useContext(Authcontext);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [invoice, setinvoice] = useState(null);
  const [amount, setAmount] = useState(null);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [desc, setDesc] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);
  const [gst, setGst] = useState(null);

   const [formErrors, setFormErrors] = useState({});



  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleClear = () => {
    setAmount(''),
      setCategory(''),
      setinvoice(''),
      setDesc(''),
      setReceiptImage(),
      setGst('')
  }

  useEffect(() => {
    const app = getApp();
    const db = getDatabase(app);
    const categoryRef = ref(db, '/categories');

    onValue(categoryRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data)
          .filter(key => data[key] && data[key].name)
          .map(key => ({
            id: key,
            name: data[key].name,
          }));
        setCategories(list);
      }
    });
  }, []);

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) return;

    const app = getApp();
    const db = getDatabase(app);
    const categoryRef = ref(db, 'categories');

    const newRef = push(categoryRef);
    set(newRef, { name: newCategoryName })
      .then(() => {
        setIsAddingNewCategory(false);
        setNewCategoryName('');
        setCategory(newCategoryName);
      })
      .catch(err => {
        console.error('Error saving new category:', err);
      });
  };

  const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      ]);

      return (
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.READ_MEDIA_IMAGES'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};


const handleImagePick = async () => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    Alert.alert("Permission denied", "Gallery access is required.");
    return;
  }

  launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (res) => {
    if (!res.didCancel && !res.errorCode) {
      setReceiptImage(res.assets[0]);
    }
  });
};


const handleSubmit = async () => {
  showLoader();

let errors = {};

if (!amount || !amount.trim()) errors.amount = 'Amount is Required';
if (!category || !category.trim()) errors.category = 'Category is Required';
if (!invoice || !invoice.trim()) errors.invoice = 'Invoice is Required';

setFormErrors(errors);

if (Object.keys(errors).length > 0) return;


  const app = getApp();
  const db = getDatabase(app);

  const lastIdRef = ref(db, 'expenseid/lastid');
  let newId = 1;

  try{
    const snapshot = await get(lastIdRef);
    if(snapshot.exists()) {
      const lastId = parseInt(snapshot.val(), 10);
      newId = lastId + 1;
    }
  
  } catch (error) {
     console.error('Failed to read lastid:', error);
    Alert.alert('Error reading expense ID');
    return;
  }

  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate().toString().padStart(2, '0');
  const shortMonth = monthsShort[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  const formattedDate = `${day}${shortMonth}${year}`;

  const expenseId = `${String(newId).padStart(2, '0')}_${formattedDate}`;

  let imageUrl = '';
  if(receiptImage?.uri) {
 try {
  const filename = `${expenseId}_${Date.now()}.jpg`;
  const storageRef = storage().ref(`receipts/${filename}`);

  await storageRef.putFile(receiptImage.uri);  // 🔁 Only AFTER this, get download URL
  imageUrl = await storageRef.getDownloadURL();  // ✅ Now the file definitely exists
} catch (uploadErr) {
  console.error('Image upload failed:', uploadErr);
  Alert.alert('Failed to upload receipt image');
  return;
}
  }

  const expenseData ={
    expenseId,
    name: user?.name || '',
    invoice,
    date: date.toISOString(),
    amount,
    category,
    description: desc || '',
    gst: gst || '',
    imageUrl,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  const expenseRef = ref(db, `expensedetails/${expenseId}`);

  try{
    await set(expenseRef, expenseData);
    await set(lastIdRef, String(newId));
        Alert.alert('Expense saved successfully!');
    handleClear();
  } catch (err) {
    console.error('Error saving expense:', err);
    Alert.alert('Failed to save expense');
  }
  finally {
    hideLoader();
  }

};

  return (
    <View style={styles.screen}>
      <View style={styles.bar}></View>

      {/* Header Gradient */}
      <LinearGradient
        colors={['#5312A6', '#B51396']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Expense</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.formContainer}>

        {/* Invoice No */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>Name</Text>
          <TextInput value={user?.name || ''} style={styles.input} editable={false} />
        </View>

        {/* Invoice No */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>INVOICE NO</Text>
          <TextInput placeholder="" style={styles.input}
            value={invoice}
            onChangeText={setinvoice}
          />
          {formErrors.invoice && <Text style={{ color: 'red', fontSize: 12 }}>{formErrors.invoice}</Text>}
        </View>

        {/* Date */}
        <TouchableOpacity style={styles.inputBox} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.label}>DATE</Text>
          <View style={styles.dateRow}>
            <TextInput
              value={date.toLocaleDateString()}
              editable={false}
              style={[styles.input, { flex: 1 }]}
            />
            <Icon name="calendar" size={20} color="#800080" />
          </View>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Amount */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>AMOUNT</Text>
          <TextInput keyboardType="numeric" style={styles.input}
            value={amount}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, ''); // allow only numbers
              setAmount(numericText);
            }}
          />
          {formErrors.amount && <Text style={{ color: 'red', fontSize: 12 }}>{formErrors.amount}</Text>}
        </View>

        {/* Category Picker */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>CATEGORY</Text>
          <ScrollView style={{ borderBottomWidth: 1, borderBottomColor: '#c27ba0' }}>
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
              }}
            >
              <Picker.Item label="Select Category" value={null} enabled={false} />
              {categories.map(cat => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
              ))}
              <Picker.Item label="➕ Add New Category" value="add_new" />
            </Picker>
          </ScrollView>
          {formErrors.category && <Text style={{ color: 'red', fontSize: 12 }}>{formErrors.category}</Text>}
        </View>

        {/* Add New Category Input */}
        {isAddingNewCategory && (
          <View style={{ marginBottom: 20 }}>
            <TextInput
              placeholder="Enter new category"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={handleAddNewCategory}
              style={{ backgroundColor: '#800080', padding: 10, borderRadius: 8, marginTop: 8 }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Save Category</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Description */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput multiline numberOfLines={2} style={styles.input} placeholder='Enter Description (Optional)'
            value={desc}
            onChangeText={setDesc}
          />
        </View>

         <View style={styles.inputBox}>
          <Text style={styles.label}>GST Number</Text>
          <TextInput placeholder="Enter GST (Optional)" style={styles.input}
            value={gst}
            onChangeText={setGst}
          />        
        </View>

        {/* Attach File */}
        <View style={[styles.inputBox, { height: 180, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.label, { alignSelf: 'flex-start' }]}>ATTACH FILE</Text>
        <TouchableOpacity style={styles.attachmentBox} onPress={handleImagePick}>
          {receiptImage ? (
            <Image
              source={{ uri: receiptImage.uri }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
              resizeMode="cover"
            />
          ) : (
            <Icon name="plus" size={32} color="#888" />
          )}
        </TouchableOpacity>
      </View>


        <View style={styles.btns}>
          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleClear}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default AddExpense;

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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
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
