import { StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";
import { useFontSize } from "../context/fontSizeContext";


const createCategoriesBudgetSummaryStyles = () => {
  const { colors } = useTheme();
  const cardRadius = colors?.radii?.card ?? 20;
  const pillRadius = colors?.radii?.pill ?? 12;
  const circleRadius = colors?.radii?.circle ?? 999;
  const { getFontSizeByKey } = useFontSize();
  const fontSize = (key) => getFontSizeByKey(key);
  const styles = StyleSheet.create({    
    categoriesBudgetSummaryContainer: {
      flex: 1,
      marginTop: 15,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: cardRadius,
      padding: 10,
    },
    categoriesBudgetSummaryTitle: {
      fontSize: fontSize("lg"),
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
      fontSize: fontSize("md"),
      color: colors.text,
      fontWeight: "bold",
    },
    categoriesBudgetSummaryBudgetAmountContainer: {
        fontSize: fontSize("sm"),
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
      borderRadius: pillRadius,
      marginTop: 8,
    },
    categoriesBudgetSummaryProgressBar: {
      height: "100%",
      borderRadius: circleRadius,
      overflow: "hidden",
    },
  });
  return styles;
};

export default createCategoriesBudgetSummaryStyles;
