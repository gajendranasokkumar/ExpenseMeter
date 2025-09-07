import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import createHistoryStyles from "../styles/history.styles";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";
import { categories } from "../constants/Categories";
import { formatDate } from "../utils/formatDate";

const SingleTransaction = ({ transaction, onDelete }) => {
  const styles = createHistoryStyles();
  const { colors } = useTheme();

  const getIcon = (category) => {
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
      <View style={styles.transactionContainer}>
        <View style={styles.transactionLeft}>
          <Ionicons
            name={getIcon(transaction.category.toLowerCase())}
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
              + {formatAmountDisplay(transaction.amount)}
            </Text>
          ) : (
            <Text style={[styles.transactionRightAmount, { color: colors.expenseMuted }]}>
              - {formatAmountDisplay(Math.abs(transaction.amount))}
            </Text>
          )}
        </View>
        {/* <Text>{transaction.category}</Text> */}
      </View>
    </TouchableOpacity>
  );
};

export default SingleTransaction;
