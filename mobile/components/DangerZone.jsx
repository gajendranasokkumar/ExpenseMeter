import { Text, ActivityIndicator, Alert, View } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../hooks/useTheme";
import createSettingsStyles from "../styles/settings.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import useTransations from "../hooks/useTransations";
import useLanguage from "../hooks/useLanguage";

const DangerZone = () => {
  const { colors } = useTheme();
  const styles = createSettingsStyles();
  const { t } = useLanguage();

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
      Alert.alert(
        t("dangerZone.alerts.logoutTitle", { defaultValue: "Logout" }),
        t("dangerZone.alerts.logoutMessage", {
          defaultValue: "Are you sure you want to logout?",
        }),
        [
          {
            text: t("common.cancel", { defaultValue: "Cancel" }),
            style: "cancel",
          },
          {
            text: t("common.ok", { defaultValue: "OK" }),
            onPress: () => handleLogout(),
          },
        ]
      );
    } catch (e) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        t("dangerZone.alerts.logoutError", {
          defaultValue: "Failed to logout. Please try again.",
        })
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <LinearGradient colors={colors.gradients.surface} style={styles.section}>
      <View style={styles.profileSectionHeader}>
        <Text style={styles.sectionTitleDanger}>
          {t("dangerZone.title", { defaultValue: "Danger zone" })}
        </Text>
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
          <Text style={styles.settingText}>
            {t("dangerZone.logout", { defaultValue: "Logout" })}
          </Text>
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
          <Text style={styles.settingText}>
            {t("dangerZone.deleteAllTransactions", {
              defaultValue: "Delete all transactions",
            })}
          </Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default DangerZone;
