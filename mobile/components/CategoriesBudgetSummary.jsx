import { View, Text, ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import createCategoriesBudgetSummaryStyles from "../styles/categoriesBudgetSummary.styles";
import { useUser } from "../context/userContext";
import { BUDGET_ROUTES } from "../constants/endPoints";
import api from "../utils/api";
import { useFocusEffect } from "@react-navigation/native";
import { getCurrentMonth, getCurrentYear } from "../utils/formatDate";
import useTheme from "../hooks/useTheme";
import { formatAmountDisplay } from "../utils/formatAmountDisplay";
import { LinearGradient } from "expo-linear-gradient";
import ProgressBar from "./ProgressBar";

const CategoriesBudgetSummary = () => {
  const { user } = useUser();
  const userId = user?._id;
  const [period, setPeriod] = useState({
    month: getCurrentMonth(),
    year: getCurrentYear(),
  });
  const [categoriesBudgetSummary, setCategoriesBudgetSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();
  const styles = createCategoriesBudgetSummaryStyles();

  const getCategoriesBudgetSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `${BUDGET_ROUTES.GET_BUDGETS_AND_EXPENSES_BY_CATEGORY_FOR_MONTH_AND_YEAR.replace(
          ":id",
          userId
        )}?month=${period.month}&year=${period.year}`
      );
      setCategoriesBudgetSummary(response.data.categories);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      getCategoriesBudgetSummary();
    }, [getCategoriesBudgetSummary])
  );

  if(categoriesBudgetSummary.length === 0) {
    return null;
  }

  return (
    <View style={styles.categoriesBudgetSummaryContainer}>
      {isLoading ? (
        <View style={styles.categoriesBudgetSummaryLoadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <>
          {/* <Text style={styles.categoriesBudgetSummaryTitle}>
            Budget by category
          </Text> */}
          {categoriesBudgetSummary.map((category, index) => (
            <View
              key={index}
              style={styles.categoriesBudgetSummaryItemContainer}
            >
              <View style={styles.categoriesBudgetSummaryItem}>
                <Text style={styles.categoriesBudgetSummaryCategory}>
                  {category.category}
                </Text>
                <Text
                  style={styles.categoriesBudgetSummaryBudgetAmountContainer}
                >
                  <Text style={styles.categoriesBudgetSummaryBudgetAmount}>
                    {formatAmountDisplay(category.budgetAmount)}
                  </Text>{" "}
                  /
                  <Text style={styles.categoriesBudgetSummaryTotalExpenses}>
                    {" "}
                    {formatAmountDisplay(category.totalExpenses)}
                  </Text>{" "}
                  /
                  <Text style={styles.categoriesBudgetSummaryRemainingBudget}>
                    {" "}
                    {formatAmountDisplay(category.remainingBudget)}
                  </Text>
                </Text>
              </View>
              <ProgressBar percentageUsed={category.percentageUsed} />
            </View>
          ))}
        </>
      )}
    </View>
  );
};

export default CategoriesBudgetSummary;
