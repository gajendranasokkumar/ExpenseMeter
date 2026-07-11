
import { Alert } from 'react-native';
import { useUser } from '../context/userContext';
import * as transactionService from '../services/transactionService';

const useTransations = () => {
  const { user } = useUser();
  const userId = user?._id;
    
  

  const deleteTransaction = async (id) => {
    try {
      Alert.alert('Are you sure you want to delete this transaction?', 'This action cannot be undone', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
          transactionService.remove(id);
        } },
      ]);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || error?.message);
    }
  };

  const deleteAllTransactions = async () => {
    try {
      Alert.alert('Are you sure you want to delete all transactions?', 'This action cannot be undone', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
          if (!userId) return;
          transactionService.removeAllByUser(userId);
        } },
      ]);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || error?.message);
    }
  };

  const createTransaction = async (title, amount, category) => {
    try {
      const response = await transactionService.create({ title, amount, category, user_id: userId });
      Alert.alert('Success', 'Transaction created successfully');
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || error?.message);
    }
  };


  return { deleteTransaction, deleteAllTransactions, createTransaction };
}

export default useTransations