import { View, Text, ActivityIndicator, Image } from "react-native";
import React, { useState, useCallback } from "react";
import banksSummaryStyles from "../styles/banksSummary.styles";
import * as bankService from "../services/bankService";
import { useUser } from "../context/userContext";
import { useFocusEffect } from "@react-navigation/native";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";
import useTheme from "../hooks/useTheme";
import useLanguage from "../hooks/useLanguage";
import useCurrencyPreference from "../hooks/useCurrencyPreference";
import { getBankLogoSource, extractBankCode } from "../utils/bankLogos";

const SavingsSummary = () => {
  const styles = banksSummaryStyles();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { currencyCode } = useCurrencyPreference();
  const [savings, setSavings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const userId = user?._id;

  const fetchSavings = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await bankService.summary(userId);
      setSavings((list || []).filter((bank) => bank.isSavings));
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchSavings();
    }, [fetchSavings])
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  if (savings.length === 0) {
    return null;
  }

  const totalSavings = savings.reduce(
    (sum, bank) => sum + (bank.availableBalance || 0),
    0
  );

  return (
    <>
      <Text style={styles.banksSummaryTitle}>
        {t("home.savings.title", { defaultValue: "Savings" })}
      </Text>
      <View style={styles.banksSummaryContainer}>
        {savings.map((bank) => (
          <View key={bank._id}>
            <View style={styles.bankSummaryItem}>
              <Image
                source={getBankLogoSource(extractBankCode(bank))}
                style={styles.bankSummaryItemLogo}
              />
              <Text style={styles.bankSummaryItemName}>{bank.name}</Text>
              <Text style={styles.bankSummaryItemBalance}>
                {formatAmountDisplay(bank.availableBalance, currencyCode)}
              </Text>
            </View>
          </View>
        ))}
        <View style={styles.bankSummaryItem}>
          <Text style={[styles.bankSummaryItemName]}>
            {t("home.savings.total", { defaultValue: "Total Savings" })}
          </Text>
          <Text style={[styles.bankSummaryItemBalance, { fontWeight: "700", color: colors.primary }]}>
            {formatAmountDisplay(totalSavings, currencyCode)}
          </Text>
        </View>
      </View>
    </>
  );
};

export default SavingsSummary;
