import React from "react";
import {
  Linking,
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

const Support = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = createMoreStyles();

  const contactOptions = [
    {
      key: "email",
      title: t("support.option.email.title"),
      description: t("support.option.email.description"),
      icon: "mail-outline",
      action: () => Linking.openURL("mailto:support@expensemeter.app"),
    },
    {
      key: "docs",
      title: t("support.option.docs.title"),
      description: t("support.option.docs.description"),
      icon: "book-outline",
      action: () => Linking.openURL("https://expensemeter.app/docs"),
    },
  ];

  const handlePress = (option) => {
    try {
      option.action?.();
    } catch (error) {
      console.warn("Unable to open link:", error);
    }
  };

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
        <Text style={styles.title}>{t("support.title")}</Text>
        <View style={styles.spacer} />
      </View>

      <Text style={styles.sectionDescription}>
        {t("support.description")}
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.screenContent}
      >
        <View style={styles.surfaceCard}>
          {contactOptions.map((option, index) => (
            <View key={option.key}>
              <TouchableOpacity
                style={styles.listRow}
                activeOpacity={0.8}
                onPress={() => handlePress(option)}
              >
                <View style={styles.rowLeft}>
                  <Ionicons
                    name={option.icon}
                    size={20}
                    color={colors.primary}
                    style={styles.rowIcon}
                  />
                  <View>
                    <Text style={styles.listRowTitle}>
                      {option.title}
                    </Text>
                    <Text style={styles.listRowSubtitle}>
                      {option.description}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
              {index !== contactOptions.length - 1 ? (
                <View style={styles.divider} />
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Support;

