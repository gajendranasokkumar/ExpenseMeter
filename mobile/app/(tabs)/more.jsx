import React, { useMemo } from "react";
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
import useLanguage from "../../hooks/useLanguage";
import { useFontSize } from "../../context/fontSizeContext";

const More = () => {
  const { colors, currentTheme, themeNames } = useTheme();
  const { currentLanguage, languageMeta, t } = useLanguage();
  const { currentPreset } = useFontSize();
  const styles = createMoreStyles();

  const sections = useMemo(
    () => [
      {
        key: "preferences",
        title: t("more.section.preferences"),
        options: [
          {
            key: "settings",
            title: t("more.option.settings.title"),
            description: t("more.option.settings.description"),
            icon: "settings-outline",
            onPress: () => router.push("/(tabs)/settings"),
          },
          {
            key: "languages",
            title: t("more.option.languages.title"),
            description: t("more.option.languages.description"),
            icon: "language",
            trailingText:
              languageMeta[currentLanguage]?.label ?? "English",
            onPress: () => router.push("/(tabs)/languages"),
          },
          {
            key: "themes",
            title: t("more.option.themes.title"),
            description: t("more.option.themes.description"),
            icon: "color-palette-outline",
            trailingText:
              themeNames?.[currentTheme] ?? "Default",
            onPress: () => router.push("/(tabs)/themes"),
          },
          {
            key: "fontsizes",
            title: t("more.option.fontSizes.title", {
              defaultValue: "Font sizes",
            }),
            description: t("more.option.fontSizes.description", {
              defaultValue: "Adjust how large text appears across the app",
            }),
            icon: "text-outline",
            trailingText: currentPreset?.name ?? "Medium",
            onPress: () => router.push("/(tabs)/fontsizes"),
          },
          {
            key: "categories",
            title: t("more.option.categories.title"),
            description: t("more.option.categories.description"),
            icon: "pricetags-outline",
            onPress: () => router.push("/(tabs)/categories"),
          },
        ],
      },
      {
        key: "support",
        title: t("more.section.support"),
        options: [
          {
            key: "support-center",
            title: t("more.option.support.title"),
            description: t("more.option.support.description"),
            icon: "help-circle-outline",
            onPress: () => router.push("/(tabs)/support"),
          },
        ],
      },
    ],
    [currentLanguage, currentTheme, currentPreset, languageMeta, t, themeNames]
  );

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <View style={styles.header}>
        {/* <View style={styles.spacer} /> */}
        <Text style={styles.masterTitle}>{t("more.title")}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {sections.map((section) => (
          <View style={styles.section} key={section.key}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.options.map((option) => (
              <TouchableOpacity
                key={option.key}
                activeOpacity={0.8}
                onPress={option.onPress}
                style={styles.optionCard}
              >
                <View style={styles.optionInner}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={option.icon}
                      size={22}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.optionTextWrapper}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    {option.description ? (
                      <Text style={styles.optionDescription}>
                        {option.description}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.trailing}>
                    {option.trailingText ? (
                      <Text style={styles.trailingText}>
                        {option.trailingText}
                      </Text>
                    ) : null}
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.textMuted}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default More;

