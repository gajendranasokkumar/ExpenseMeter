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
import useCurrencyPreference from "../../hooks/useCurrencyPreference";

const Currencies = () => {
  const { colors } = useTheme();
  const styles = createMoreStyles();
  const { t } = useLanguage();
  const { availableCurrencies, currencyCode, setCurrencyCode } =
    useCurrencyPreference();

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
        <Text style={styles.title}>{t("currencies.title")}</Text>
        <View style={styles.spacer} />
      </View>

      <Text style={styles.sectionDescription}>
        {t("currencies.description")}
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.screenContent}
      >
        <View style={styles.surfaceCard}>
          {availableCurrencies.map((currency, index) => {
            const isSelected = currency.code === currencyCode;

            return (
              <View key={currency.code}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.listRow}
                  onPress={() => setCurrencyCode(currency.code)}
                >
                  <View style={styles.rowLeft}>
                    <Text
                      style={[
                        styles.rowIcon,
                        {
                          color: colors.primary,
                          fontSize: 20,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {currency.symbol}
                    </Text>
                    <View>
                      <Text style={styles.listRowTitle}>
                        {currency.label}
                      </Text>
                      <Text style={styles.listRowSubtitle}>
                        {currency.symbol} · {currency.code}
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
                {index !== availableCurrencies.length - 1 ? (
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

export default Currencies;

