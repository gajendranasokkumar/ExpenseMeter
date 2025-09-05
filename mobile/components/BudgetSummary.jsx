import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import createHomeStyles from "../styles/home.styles";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../hooks/useTheme";
import { BUDGET_ROUTES } from "../constants/endPoints";
import api from "../utils/api";
import { useUser } from "../context/userContext";
import { useFocusEffect } from "@react-navigation/native";
import { getCurrentMonth } from "../utils/formatDate";

const BudgetSummary = () => {
  const styles = createHomeStyles();
  const { colors } = useTheme();
  const { user } = useUser();
  const userId = user?._id;
  const [budget, setBudget] = useState({});
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [progressColor, setProgressColor] = useState([
    colors.success,
    colors.success,
  ]);
  const [progressPercentageColor, setProgressPercentageColor] = useState(
    colors.success
  );

  const calculateProgress = () => {
    setProgress(
      Math.round((budget.currentExpenses / budget.budgetLimit) * 100)
    );
  };

  useEffect(() => {
    calculateProgress();
  }, [budget]);

  useEffect(() => {
    if (progress <= 25) {
      setProgressColor([colors.success, colors.success]);
      setProgressPercentageColor(colors.success);
    } else if (progress <= 50) {
      setProgressColor([colors.success, colors.warning]);
      setProgressPercentageColor(colors.warning);
    } else if (progress <= 75) {
      setProgressColor([colors.success, colors.warning, colors.orange]);
      setProgressPercentageColor(colors.orange);
    } else {
      setProgressColor([
        colors.success,
        colors.warning,
        colors.orange,
        colors.danger,
      ]);
      setProgressPercentageColor(colors.danger);
    }
  }, [progress, colors.success, colors.warning, colors.orange, colors.danger]);

  const getCurrentMonthBudget = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `${BUDGET_ROUTES.GET_BUDGETS_BY_USER_ID_AND_CATEGORY_FOR_CURRENT_MONTH.replace(
          ":id",
          userId
        )
          .replace(":category", "Monthly Budget")
          .replace(":currentMonth", getCurrentMonth())}`
      );
      setBudget({
        budgetLimit: response.data.amount,
        currentExpenses: response.data.totalAmountSpentonThisMonth,
        remainingBudget: response.data.amount - response.data.totalAmountSpentonThisMonth,
      });
    } catch (error) {
      setBudget({});
      // Alert.alert("Error", "Failed to get current month budget");
    } finally {
      setIsLoading(false);
    }
    calculateProgress();
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      getCurrentMonthBudget();
    }, [getCurrentMonthBudget])
  );

  const handleSetBudgetAsPrevious = async () => {
    try {
      setIsLoading(true);
      await api.post(
        `${BUDGET_ROUTES.CREATE_MONTHLY_BUDGET_AS_PREVIOUS.replace(":id", userId).replace(":month", getCurrentMonth())}`
      );
      Alert.alert("Success", "Budget set as previous successfully");
      getCurrentMonthBudget();
    } catch (error) {
      Alert.alert("Error", error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const setBudgetAsPrevious = () => {
    
      Alert.alert("Warning", "Are you sure you want to set the budget as previous month's budget?", [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: handleSetBudgetAsPrevious },
      ]);
    
  };

  return (
    <View style={styles.budgetSummaryContainer}>
      {isLoading ? (
        <View style={styles.budgetSummaryLoadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (budget.budgetLimit && budget.currentExpenses) ? (
        <>
          <View style={styles.budgetSummaryTitleContainer}>
            <Text style={styles.budgetSummaryTitle}>Current month budget</Text>
            <View style={styles.burgetSUmmaryPercent}>
              <Text
                style={[
                  styles.burgetSUmmaryPercentText,
                  { color: progressPercentageColor },
                ]}
              >
                {progress < 100 ? progress : "> 100"}%
              </Text>
            </View>
          </View>
          <View style={styles.budgetSummaryContent}>
            <View style={styles.budgetSummaryContentLeft}>
              <Text style={styles.budgetSummaryAmountTitle}>
                Total Expenses
              </Text>
              <Text style={styles.budgetSummaryAmountLeft}>
                {formatAmountDisplay(budget.currentExpenses)}
              </Text>
            </View>
            <View style={styles.budgetSummaryContentRight}>
              <Text style={styles.budgetSummaryAmountTitle}>Budget Limit</Text>
              <Text style={styles.budgetSummaryAmountRight}>
                {formatAmountDisplay(budget.budgetLimit)}
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressBarFill,
                { width: `${progress < 100 ? progress : 100}%` },
              ]}
              colors={progressColor}
            />
          </View>
          <View style={styles.remainingBudgetContainer}>
            { budget.remainingBudget > 0 ? (
            <Text style={styles.remainingBudgetTitle}>
                You can spend <Text style={styles.remainingBudgetAmount}>{formatAmountDisplay(budget.remainingBudget)}</Text> more this month.
              </Text>
            ) : (
              <Text style={styles.remainingBudgetTitle}>
                You have exceeded your budget this month.
              </Text>
            )}
          </View>
        </>
      ) : (
        <View style={styles.budgetFailureTitleContainer}>
          <Text style={styles.budgetFailureTitle}>Set your monthly budget to see your progress here.</Text>
          <TouchableOpacity onPress={() => setBudgetAsPrevious()}>
            <Text style={styles.budgetFailureTitleButton}>Set as previous month&apos;s budget</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default BudgetSummary;
