import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../../hooks/useTheme";
import createSettingsStyles from "../../styles/settings.styles";
import Preferences from "../../components/Preferences";
import DangerZone from "../../components/DangerZone";
import ProfileSection from "../../components/ProfileSection";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useLanguage from "../../hooks/useLanguage";

const Settings = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = createSettingsStyles();

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(tabs)/more")}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t("settings.title")}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <ProfileSection />
          {/* <Preferences /> */}
          <DangerZone />
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Settings;
