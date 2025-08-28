import { View, Text } from 'react-native'
import React from 'react'
import useTheme from '../../hooks/useTheme'
import { LinearGradient } from 'expo-linear-gradient'
import createProfileStyles from '../../styles/profile.styles'

const Profile = () => {
  const { colors } = useTheme();
  const styles = createProfileStyles();
  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <View style={styles.content}>
        <Text>Profile</Text>
      </View>
    </LinearGradient>
  )
}

export default Profile