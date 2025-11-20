import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Switch,
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
import { useNotificationPreferences } from "../../context/notificationPreferencesContext";
import useCurrencyPreference from "../../hooks/useCurrencyPreference";

const More = () => {
  const { colors, currentTheme, themeNames } = useTheme();
  const { currentLanguage, languageMeta, t } = useLanguage();
  const { currentPreset } = useFontSize();
  const {
    persistentNotificationEnabled,
    isNotificationPreferenceLoading,
    isUpdatingPersistentNotification,
    setPersistentNotificationEnabled,
  } = useNotificationPreferences();
  const { currency } = useCurrencyPreference();
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
            key: "currency",
            title: t("more.option.currencies.title", {
              defaultValue: "Currency",
            }),
            description: t("more.option.currencies.description", {
              defaultValue: "Choose how monetary values are displayed",
            }),
            icon: "cash-outline",
            trailingText: currency
              ? `${currency.symbol} ${currency.code}`
              : "INR",
            onPress: () => router.push("/(tabs)/currencies"),
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
          {
            key: "export-data",
            title: t("more.option.exportData.title", {
              defaultValue: "Export data",
            }),
            description: t("more.option.exportData.description", {
              defaultValue: "Download Excel backups or share via WhatsApp",
            }),
            icon: "cloud-download-outline",
            onPress: () => router.push("/(tabs)/exportData"),
          },
          {
            key: "persistent-notification",
            title: t("more.option.notifications.title", {
              defaultValue: "Persistent notification",
            }),
            description: t("more.option.notifications.description", {
              defaultValue:
                "Keep a pinned alert so you can reopen Expense Meter instantly.",
            }),
            icon: "notifications-outline",
            type: "toggle",
            value: persistentNotificationEnabled,
            onToggle: (nextValue) =>
              setPersistentNotificationEnabled(
                typeof nextValue === "boolean"
                  ? nextValue
                  : !persistentNotificationEnabled
              ),
            loading:
              isNotificationPreferenceLoading ||
              isUpdatingPersistentNotification,
            disabled:
              isNotificationPreferenceLoading ||
              isUpdatingPersistentNotification,
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
    [
      currency,
      currentLanguage,
      currentTheme,
      currentPreset,
      isNotificationPreferenceLoading,
      isUpdatingPersistentNotification,
      languageMeta,
      persistentNotificationEnabled,
      setPersistentNotificationEnabled,
      t,
      themeNames,
    ]
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
            {section.options.map((option) => {
              const isToggle = option.type === "toggle";
              const onPress =
                isToggle && option.onToggle
                  ? () => option.onToggle(!option.value)
                  : option.onPress;
              return (
                <TouchableOpacity
                  key={option.key}
                  activeOpacity={isToggle ? 1 : 0.8}
                  onPress={onPress}
                  disabled={option.disabled}
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
                      {isToggle ? (
                        option.loading ? (
                          <ActivityIndicator color={colors.primary} />
                        ) : (
                          <Switch
                            value={option.value}
                            onValueChange={option.onToggle}
                            trackColor={{
                              false: colors.border,
                              true: colors.primary,
                            }}
                            thumbColor={colors.text}
                            disabled={option.disabled}
                          />
                        )
                      ) : (
                        <>
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
                        </>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default More;

