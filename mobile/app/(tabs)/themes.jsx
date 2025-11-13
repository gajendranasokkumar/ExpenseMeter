import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useTheme from "../../hooks/useTheme";
import createMoreStyles from "../../styles/more.styles";
import Preferences from "../../components/Preferences";
import useLanguage from "../../hooks/useLanguage";

const Themes = () => {
  const { colors, themeNames, currentTheme } = useTheme();
  const { t } = useLanguage();
  const styles = createMoreStyles();

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)/more")}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t("themes.title")}</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.screenContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("themes.section.current")}</Text>
          <View style={styles.surfaceCard}>
            <View style={styles.listRow}>
              <View style={styles.rowLeft}>
                <Ionicons
                  name="color-palette-outline"
                  size={20}
                  color={colors.primary}
                  style={styles.rowIcon}
                />
                <View>
                  <Text style={styles.listRowTitle}>
                    {themeNames?.[currentTheme] ?? "Default"}
                  </Text>
                  <Text style={styles.listRowSubtitle}>
                    {t("themes.section.current.subtitle")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <Preferences />
      </ScrollView>
    </LinearGradient>
  );
};

export default Themes;

