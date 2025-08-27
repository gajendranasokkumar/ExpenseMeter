import { Text, ActivityIndicator, Alert, View } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../hooks/useTheme";
import createSettingsStyles from "../styles/settings.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const DangerZone = () => {
  const { colors } = useTheme();
  const styles = createSettingsStyles();

  const [clearing, setClearing] = useState(false);

  const handleClearStorage = async () => {
    if (clearing) return;

    setClearing(true);
    try {
      await AsyncStorage.clear();
      Alert.alert("Done", "Successfully logged out.", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (e) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <LinearGradient colors={colors.gradients.surface} style={styles.section}>
      <Text style={styles.sectionTitleDanger}>Danger Zone</Text>
      <TouchableOpacity
        onPress={handleClearStorage}
        activeOpacity={0.8}
        style={styles.clearButton}
        disabled={clearing}
      >
        {clearing ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.settingText}>Logout</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default DangerZone;
