import React from "react";
import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../../hooks/useTheme";
import createSettingsStyles from "../../styles/settings.styles";
import Preferences from "../../components/Preferences";
import DangerZone from "../../components/DangerZone";

const Settings = () => {
  const { colors } = useTheme();
  const styles = createSettingsStyles();

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <ScrollView>
          <Preferences />
          <DangerZone />
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Settings;
