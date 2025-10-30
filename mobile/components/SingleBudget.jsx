import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import createHistoryStyles from "../styles/history.styles";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";
import { categories } from "../constants/Categories";
import { formatDate } from "../utils/formatDate";
import ProgressBar from "./ProgressBar";

const SingleBudget = ({ budget, onDelete, showProgressbar=false }) => {
  const styles = createHistoryStyles();
  const { colors } = useTheme();

  const getIcon = (category) => {
    const categoryData = categories.find(
      (cat) => cat.name.toLowerCase() === category.toLowerCase()
    );
    return categoryData?.unselectedIcon || "ellipsis-horizontal-outline";
  };

  return (
    <TouchableOpacity
      onLongPress={() => {
        Alert.alert(
          "Delete Budget",
          "Are you sure you want to delete this budget?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => onDelete(budget._id),
            },
          ]
        );
      }}
    >
      <View style={styles.transactionContainerForBudget}>
        <View style={styles.transactionContainerTop}>
          <View style={styles.transactionLeft}>
            <Ionicons
              name={getIcon(budget.category.toLowerCase())}
              size={24}
              color={colors.incomeMuted}
            />
          </View>
          <View style={styles.transactionCenter}>
            <Text style={styles.transactionCenterTitle}>{budget.title}</Text>
            <Text style={styles.transactionCenterDate}>
              {formatDate(budget.start_date)}
            </Text>
          </View>
          <View style={styles.transactionRight}>
            <Text
              style={[
                styles.transactionRightAmount,
                { color: colors.incomeMuted },
              ]}
            >
              {formatAmountDisplay(budget.amount)}
            </Text>
            <Text
              style={[
                styles.transactionRightAmount,
                { color: colors.expenseMuted },
              ]}
            >
              {formatAmountDisplay(budget.amountSpent)}
            </Text>
          </View>
        </View>
        { showProgressbar && <ProgressBar
          percentageUsed={
            budget.amountSpent > 0
              ? Math.round((budget.amountSpent / budget.amount) * 100)
              : 0
          }
        /> }
      </View>
    </TouchableOpacity>
  );
};

export default SingleBudget;
