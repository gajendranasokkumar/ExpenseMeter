
import api from '../utils/api';
import { Alert } from 'react-native';
import { useUser } from '../context/userContext';
import { TRANSACTION_ROUTES } from '../constants/api';

const useTransations = () => {
  const { user } = useUser();
  const userId = user?._id;
    
  

  const deleteTransaction = async (id) => {
    try {
      Alert.alert('Are you sure you want to delete this transaction?', 'This action cannot be undone', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
          api.delete(`${TRANSACTION_ROUTES.DELETE_TRANSACTION.replace(":id", id)}`);
        } },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response.data.message);
    }
  };

  const deleteAllTransactions = async () => {
    try {
      Alert.alert('Are you sure you want to delete all transactions?', 'This action cannot be undone', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
          if (!userId) return;
          api.delete(`${TRANSACTION_ROUTES.DELETE_ALL_TRANSACTIONS.replace(":id", userId)}`);
        } },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response.data.message);
    }
  };

  const createTransaction = async (title, amount, category) => {
    try {
      const response = await api.post(`${TRANSACTION_ROUTES.CREATE_TRANSACTION}`, { title, amount, category, user_id: userId });
      Alert.alert('Success', 'Transaction created successfully');
    } catch (error) {
      Alert.alert('Error', error.response.data.message);
    }
  };


  return { deleteTransaction, deleteAllTransactions, createTransaction };
}

export default useTransations