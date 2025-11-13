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
import useLanguage from "../../hooks/useLanguage";

const Languages = () => {
  const { colors } = useTheme();
  const styles = createMoreStyles();
  const {
    availableLanguages,
    languageMeta,
    currentLanguage,
    setLanguage,
    t,
  } = useLanguage();

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
        <Text style={styles.title}>{t("languages.title")}</Text>
        <View style={styles.spacer} />
      </View>

      <Text style={styles.sectionDescription}>
        {t("languages.description")}
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.screenContent}
      >
        <View style={styles.surfaceCard}>
          {availableLanguages.map((languageKey, index) => {
            const language = languageMeta[languageKey];
            const isSelected = languageKey === currentLanguage;

            return (
              <View key={languageKey}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.listRow}
                  onPress={() => setLanguage(languageKey)}
                >
                  <View style={styles.rowLeft}>
                    <Ionicons
                      name="globe-outline"
                      size={20}
                      color={colors.primary}
                      style={styles.rowIcon}
                    />
                    <View>
                      <Text style={styles.listRowTitle}>
                        {language.label}
                      </Text>
                      <Text style={styles.listRowSubtitle}>
                        {language.locale}
                      </Text>
                    </View>
                  </View>
                  {isSelected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.primary}
                    />
                  ) : (
                    <Ionicons
                      name="ellipse-outline"
                      size={20}
                      color={colors.textMuted}
                    />
                  )}
                </TouchableOpacity>
                {index !== availableLanguages.length - 1 ? (
                  <View style={styles.divider} />
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Languages;

