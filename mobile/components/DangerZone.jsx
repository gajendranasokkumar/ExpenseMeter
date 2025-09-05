import { Text, ActivityIndicator, Alert, View } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../hooks/useTheme";
import createSettingsStyles from "../styles/settings.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTransations from "../hooks/useTransations";

const DangerZone = () => {
  const { colors } = useTheme();
  const styles = createSettingsStyles();

  const [loggingOut, setLoggingOut] = useState(false);

  const { deleteAllTransactions } = useTransations();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/(auth)/login");
  };

  const handleLogoutPress = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    try {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { text: "Ok", onPress: () => handleLogout() },
      ]);
    } catch (e) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <LinearGradient colors={colors.gradients.surface} style={styles.section}>
      <View style={styles.profileSectionHeader}>
        <Text style={styles.sectionTitleDanger}>Danger Zone</Text>
      </View>
      <TouchableOpacity
        onPress={handleLogoutPress}
        activeOpacity={0.8}
        style={styles.clearButton}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.settingText}>Logout</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={deleteAllTransactions}
        activeOpacity={0.8}
        style={styles.clearButton}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.settingText}>Delete All Transactions</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default DangerZone;
