import { View, Text } from 'react-native'
import React from 'react'
import useTheme from '../../hooks/useTheme'
import { LinearGradient } from 'expo-linear-gradient'
import createBanksStyles from '../../styles/banks.styles'

const Banks = () => {
  const { colors } = useTheme();
  const styles = createBanksStyles();
  
  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <View style={styles.content}>
        <Text>Banks</Text>
      </View>
    </LinearGradient>
  )
}

export default Banks