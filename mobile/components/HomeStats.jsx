import { View, Text } from 'react-native'
import React from 'react'
import createHomeStyles from '../styles/home.styles'
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';

const HomeStats = () => {
  const styles = createHomeStyles();
  const { colors } = useTheme();
  return (
    <View style={styles.statsContainer}>
        <View style={styles.mainBalanceContainer}>
            <Text style={styles.mainBalanceTitle}>Main Balance</Text>
            <Text style={styles.mainBalanceValue}>$ {100}</Text>
        </View>
        <View style={styles.expensesContainer}>
            <View style={styles.expensesHeader}>
                <Text style={styles.expensesTitle}>
                    <Ionicons name="arrow-down-circle-outline" size={14} color={colors.textMuted} />
                    {" Income"}
                </Text>
                <Text style={[styles.expensesValue, { color: colors.income }]}>+ ${100}</Text>
            </View>
            <View style={styles.expensesHeader2}>
                <Text style={styles.expensesTitle}>
                    <Ionicons name="arrow-up-circle-outline" size={14} color={colors.textMuted} />
                    {" Expenses"}
                </Text>
                <Text style={[styles.expensesValue, { color: colors.expense }]}>- ${100}</Text>
            </View>
        </View>
    </View>
  )
}

export default HomeStats