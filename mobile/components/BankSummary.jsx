import { View, Text, ActivityIndicator, Image } from "react-native";
import React, { useState, useCallback } from "react";
import banksSummaryStyles from "../styles/banksSummary.styles";
import api from "../utils/api";
import { BANK_ROUTES } from "../constants/endPoints";
import { useUser } from "../context/userContext";
import { useFocusEffect } from "@react-navigation/native";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";
import useTheme from "../hooks/useTheme";

const BankSummary = () => {
  const styles = banksSummaryStyles();
  const { colors } = useTheme();
  const [bankSummary, setBankSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const userId = user?._id;

  const fetchBankSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get(
        BANK_ROUTES.GET_BANK_SUMMARY_BY_USER_ID.replace(":id", userId)
      );
      setBankSummary(res.data.data);
    } catch (error) {
      console.log(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchBankSummary();
    }, [fetchBankSummary])
  );

  if (bankSummary.length === 0) {
    return (
      <View style={styles.banksSummaryEmptyContainer}>
        <Text style={styles.banksSummaryEmptyTitle}>
          Add bank to see your bank summary
        </Text>
      </View>
    );
  }

  return isLoading ? (
    <ActivityIndicator size="large" color={colors.primary} />
  ) : (
    <>
      <Text style={styles.banksSummaryTitle}>Bank&apos;s Closing Balance</Text>
      <View style={styles.banksSummaryContainer}>
        {bankSummary.map((bank) => (
          <View key={bank._id}>
            <View style={styles.bankSummaryItem}>
              <Image
                source={{ uri: bank.logo }}
                style={styles.bankSummaryItemLogo}
              />
              <Text style={styles.bankSummaryItemName}>{bank.name}</Text>
              <Text style={styles.bankSummaryItemBalance}>
                {formatAmountDisplay(bank.availableBalance)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

export default BankSummary;
