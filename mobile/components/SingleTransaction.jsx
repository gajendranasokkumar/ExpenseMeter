import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import createHistoryStyles from "../styles/history.styles";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";
import { categories } from "../constants/Categories";
import { formatDate } from "../utils/formatDate";
import useCurrencyPreference from "../hooks/useCurrencyPreference";

const SingleTransaction = ({ transaction, onDelete, userCategories = [] }) => {
  const styles = createHistoryStyles();
  const { colors } = useTheme();
  const { currencyCode } = useCurrencyPreference();

  const getIcon = (category, categoryId) => {
    // If category_id exists, it's a custom category - use the icon from userCategories
    if (categoryId) {
      const customCategory = userCategories.find(
        (cat) => cat._id === categoryId || cat._id?.toString() === categoryId?.toString()
      );
      if (customCategory?.icon) {
        return customCategory.icon;
      }
    }
    
    // Otherwise, it's a default category - use the icon from Categories.jsx
    const categoryData = categories.find((cat) => cat.name.toLowerCase() === category.toLowerCase());
    return categoryData?.unselectedIcon || "ellipsis-horizontal-outline";
  };

  return (
    <TouchableOpacity onLongPress={() => {
      Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(transaction._id) },
      ]);
    }}>
      <View style={styles.transactionContainerForTrans}>
        <View style={styles.transactionLeft}>
          <Ionicons
            name={getIcon(transaction.category?.toLowerCase() || transaction.category, transaction.category_id)}
            size={24}
            color={
              transaction.amount > 0 ? colors.incomeMuted : colors.expenseMuted
            }
          />
        </View>
        <View style={styles.transactionCenter}>
          <Text style={styles.transactionCenterTitle}>{transaction.title}</Text>
          <Text style={styles.transactionCenterDate}>
            {formatDate(transaction.date)}
          </Text>
        </View>
        <View style={styles.transactionRight}>
          {transaction.amount > 0 ? (
            <Text style={[styles.transactionRightAmount, { color: colors.incomeMuted }]}>
              + {formatAmountDisplay(transaction.amount, currencyCode)}
            </Text>
          ) : (
            <Text style={[styles.transactionRightAmount, { color: colors.expenseMuted }]}>
              - {formatAmountDisplay(Math.abs(transaction.amount), currencyCode)}
            </Text>
          )}
        </View>
        {/* <Text>{transaction.category}</Text> */}
      </View>
    </TouchableOpacity>
  );
};

export default SingleTransaction;
