import { View, Text, Switch } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../hooks/useTheme";
import createSettingsStyles from "../styles/settings.styles";
import { Ionicons } from "@expo/vector-icons";

const Preferences = () => {
  const styles = createSettingsStyles();
  const { colors, isDarkMode, toggleDarkMode } = useTheme();

  return (
    <LinearGradient
      colors={colors.gradients.surface}
      style={styles.section}
    >
      <View style={styles.profileSectionHeader}>
        <Text style={styles.sectionTitle}>Preferences</Text>
      </View>

      {/* DARK MODE */}
      <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <LinearGradient colors={colors.gradients.primary} style={styles.settingIcon}>
            <Ionicons name="moon" size={18} color="#fff" />
          </LinearGradient>
          <Text style={styles.settingText}>Dark Mode</Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          thumbColor={"#fff"}
          trackColor={{ false: colors.border, true: colors.primary }}
          ios_backgroundColor={colors.border}
          style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
          scaleX={1}
          scaleY={1}
        />
      </View>
    </LinearGradient>
  );
};

export default Preferences;
