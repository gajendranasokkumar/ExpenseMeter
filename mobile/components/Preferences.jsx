import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import useTheme, { THEMES, THEME_NAMES } from "../hooks/useTheme";
import createSettingsStyles from "../styles/settings.styles";
import { Ionicons } from "@expo/vector-icons";
import useLanguage from "../hooks/useLanguage";

const Preferences = () => {
  const styles = createSettingsStyles();
  const { colors, currentTheme, setTheme, availableThemes, themeNames } = useTheme();
  const { t } = useLanguage();
  const circleRadius = colors?.radii?.circle ?? 999;

  return (
    <LinearGradient
      colors={colors.gradients.surface}
      style={styles.section}
    >
      {/* <View style={styles.profileSectionHeader}>
        <Text style={styles.sectionTitle}>Preferences</Text>
      </View> */}

      {/* THEME SELECTOR */}
      <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <LinearGradient colors={colors.gradients.primary} style={styles.settingIcon}>
            <Ionicons name="color-palette" size={18} color="#fff" />
          </LinearGradient>
          <Text style={styles.settingText}>{t("preferences.themeLabel")}</Text>
        </View>
      </View>

      {/* Theme Color Swatches */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        {availableThemes.map((themeKey) => {
          const theme = THEMES[themeKey];
          const isSelected = currentTheme === themeKey;

          return (
            <TouchableOpacity
              key={themeKey}
              onPress={() => setTheme(themeKey)}
              style={{
                alignItems: "center",
                width: "22%",
                marginBottom: 12,
                paddingHorizontal: 4,
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: circleRadius,
                  backgroundColor: theme.primary,
                  marginBottom: 8,
                  borderWidth: isSelected ? 3 : 1,
                  borderColor: isSelected ? colors.primary : colors.border,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={20} color="#fff" />
                )}
              </View>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.textMuted,
                  textAlign: "center",
                  fontWeight: isSelected ? "600" : "400",
                }}
                numberOfLines={1}
              >
                {themeNames[themeKey]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </LinearGradient>
  );
};

export default Preferences;
