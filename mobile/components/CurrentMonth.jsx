import { View, Text } from 'react-native'
import React from 'react'
import createHomeStyles from '../styles/home.styles'

const CurrentMonth = () => {    
  const styles = createHomeStyles()
  const date = new Date()

  return (
    <View style={styles.currentMonthContainer}>
      <Text style={styles.currentMonth}>{date.toLocaleString('default', { month: 'long' })}</Text>
      <View style={styles.currentMonthSeparator} />
      <Text style={styles.currentYear}>{date.getFullYear()}</Text>
    </View>
  )
}

export default CurrentMonth