import { View, Text } from 'react-native'
import React from 'react'
import useTheme from '../../hooks/useTheme'
import { LinearGradient } from 'expo-linear-gradient'
import createHistoryStyles from '../../styles/history.styles'

const Transanctions = () => {
  const { colors } = useTheme();
  const styles = createHistoryStyles();
  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <View style={styles.content}>
        <Text>Transanctions</Text>
      </View>
    </LinearGradient>
  )
}

export default Transanctions    