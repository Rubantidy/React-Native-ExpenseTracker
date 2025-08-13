import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PartnerHeader from '../../components/partner/PartnerHeader';
import { useNavigation } from '@react-navigation/native';


const PartnerHome = () => {

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <PartnerHeader />

      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PendingExpense')}>
          <Text style={styles.cardText}>Pendings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ApprovedExpense')}>
          <Text style={styles.cardText}>Approved</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RejectedExpense')}>
          <Text style={styles.cardText}>Rejected</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PartnerHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  card: {
    backgroundColor: '#1a9c9c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 3,
  },
  cardText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
