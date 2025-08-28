import { View, Text } from 'react-native'
import React from 'react'
import useTheme from '../../hooks/useTheme'
import { LinearGradient } from 'expo-linear-gradient'
import createAddTransactionStyles from '../../styles/addTransaction.styles'

const AddTransaction = () => {
  const { colors } = useTheme();
  const styles = createAddTransactionStyles();
  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <View style={styles.content}>
        <Text>AddTransaction</Text>
      </View>
    </LinearGradient>
  )
}

export default AddTransaction