import { StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";


const createCategoriesBudgetSummaryStyles = () => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({    
    categoriesBudgetSummaryContainer: {
      flex: 1,
      marginTop: 15,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 10,
    },
    categoriesBudgetSummaryTitle: {
      fontSize: 20,
      color: colors.textMuted,
      marginBottom: 15,
      borderBottomWidth: 1,
      borderColor: colors.border,
      paddingBottom: 10,
    },
    categoriesBudgetSummaryItemContainer: {
      marginBottom: 10,
    },
    categoriesBudgetSummaryItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    categoriesBudgetSummaryCategory: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "bold",
    },
    categoriesBudgetSummaryBudgetAmountContainer: {
        fontSize: 12,
        color: colors.text,
    },
    categoriesBudgetSummaryBudgetAmount: {
      color: colors.primary,
    },
    categoriesBudgetSummaryTotalExpenses: {
      color: colors.expenseMuted,
    },
    categoriesBudgetSummaryRemainingBudget: {
      color: colors.incomeMuted,
    },
    categoriesBudgetSummaryLoadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    categoriesBudgetSummaryProgressBarContainer: {
      width: "100%",
      height: 5,
      backgroundColor: colors.border,
      borderRadius: 100,
      marginTop: 8,
    },
    categoriesBudgetSummaryProgressBar: {
      height: "100%",
      borderRadius: 100,
      overflow: "hidden",
    },
  });
  return styles;
};

export default createCategoriesBudgetSummaryStyles;
