import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import createHomeStyles from '../styles/home.styles'
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import { useUser } from '../context/userContext';
import api from '../utils/api';
import { useFocusEffect } from '@react-navigation/native'

const HomeStats = () => {
  const [summary, setSummary] = useState({ balance: 0, income: 0, expenses: 0 });
  const { user } = useUser();
  const userId = user?._id;
  const styles = createHomeStyles();
  const { colors } = useTheme();

  const fetchSummary = useCallback(async () => {
    try {
      if (!userId) return;
      const response = await api.get(`/transactions/summary/${userId}`);
      setSummary(response.data);
    } catch (error) {
      Alert.alert('Error', error.response.data.message);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchSummary();
    }, [fetchSummary])
  );

  const formarExpenseAmount = (amount) => {
    return amount * -1;
  }

  return (
    <>
      <View style={styles.statsContainer}>
          <View style={styles.mainBalanceContainer}>
              <Text style={styles.mainBalanceTitle}>Main Balance</Text>
              <Text style={styles.mainBalanceValue}>$ {summary.balance}</Text>
          </View>
          <View style={styles.expensesContainer}>
              <View style={styles.expensesHeader}>
                  <Text style={styles.expensesTitle}>
                      <Ionicons name="arrow-down-circle-outline" size={14} color={colors.textMuted} />
                      {" Income"}
                  </Text>
                  <Text style={[styles.expensesValue, { color: colors.income }]}>+ ${summary.income}</Text>
              </View>
              <View style={styles.expensesHeader2}>
                  <Text style={styles.expensesTitle}>
                      <Ionicons name="arrow-up-circle-outline" size={14} color={colors.textMuted} />
                      {" Expenses"}
                  </Text>
                  <Text style={[styles.expensesValue, { color: colors.expense }]}>- ${formarExpenseAmount(summary.expenses)}</Text>
              </View>
          </View>
      </View>
      <View style={styles.afterElement} />
    </>
  )
}

export default HomeStats