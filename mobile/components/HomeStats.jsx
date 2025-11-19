import { View, Text, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import createHomeStyles from "../styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import { useUser } from "../context/userContext";
import api from "../utils/api";
import { useFocusEffect } from "@react-navigation/native";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";
import useLanguage from "../hooks/useLanguage";
import useCurrencyPreference from "../hooks/useCurrencyPreference";

const HomeStats = () => {
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const { user } = useUser();
  const userId = user?._id;
  const styles = createHomeStyles();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { currencyCode } = useCurrencyPreference();

  const fetchSummary = useCallback(async () => {
    try {
      if (!userId) return;
      const response = await api.get(`/transactions/summary/${userId}`);
      setSummary(response.data);
    } catch (error) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        error?.response?.data?.message ??
          t("home.stats.errorGeneric", {
            defaultValue: "Unable to fetch summary.",
          })
      );
    }
  }, [t, userId]);

  useFocusEffect(
    useCallback(() => {
      fetchSummary();
    }, [fetchSummary])
  );

  const formarExpenseAmount = (amount) => {
    if (amount === 0) return 0;
    return amount * -1;
  }

  return (
    <>
      <View style={styles.statsContainer}>
          <View style={styles.mainBalanceContainer}>
              <Text style={styles.mainBalanceTitle}>
                {t("home.stats.mainBalance", {
                  defaultValue: "Main Balance",
                })}
              </Text>
              <Text style={styles.mainBalanceValue}>
                {formatAmountDisplay(summary.balance, currencyCode)}
              </Text>
          </View>
          <View style={styles.expensesContainer}>
              <View style={styles.expensesHeader}>
                  <Text style={styles.expensesTitle}>
                      <Ionicons name="arrow-down-circle-outline" size={14} color={colors.textMuted} />
                      {` ${t("home.stats.income", { defaultValue: "Income" })}`}
                  </Text>
                  <Text style={[styles.expensesValue, { color: colors.income }]}>
                    + {formatAmountDisplay(summary.income, currencyCode)}
                  </Text>
              </View>
              <View style={styles.expensesHeader2}>
                  <Text style={styles.expensesTitle}>
                      <Ionicons name="arrow-up-circle-outline" size={14} color={colors.textMuted} />
                      {` ${t("home.stats.expenses", {
                        defaultValue: "Expenses",
                      })}`}
                  </Text>
                  <Text style={[styles.expensesValue, { color: colors.expense }]}>
                    -{" "}
                    {formatAmountDisplay(
                      formarExpenseAmount(summary.expenses),
                      currencyCode
                    )}
                  </Text>
              </View>
          </View>
      </View>
      <View style={styles.afterElement} />
    </>
  )
}

export default HomeStats