import { StyleSheet, Dimensions } from "react-native";
import useTheme from "../hooks/useTheme";

const { width, height } = Dimensions.get("window");

const createHomeStyles = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 24,
    },
    header: {
      marginBottom: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
      borderBottomWidth: 1,
      borderColor: colors.border,
      paddingBottom: 10,
    },
    headerIconImage: {
      width: 40,
      height: 40,
      borderRadius: 10,
    },
    headerIcon: {
      color: colors.primary,
      backgroundColor: colors.surface,
      padding: 10,
      borderRadius: 10,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "700",
    },
    headerSubtitle: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: "400",
      marginBottom: 5,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
      marginLeft: "auto",
    },
    notificationIcon: {
      color: colors.warning,
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 10,
    },
    addButton: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 10,
    },
    statsContainer: {
      backgroundColor: colors.surface,
      padding: 15,
      paddingHorizontal: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    mainBalanceContainer: {
      flexDirection: "column",
      gap: 5,
      paddingBottom: 18,
    },
    mainBalanceTitle: {
      fontSize: 16,
      fontWeight: "400",
      color: colors.textMuted,
    },
    mainBalanceValue: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
      fontFamily: "Poppins-SemiBold",
    },
    expensesContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    expensesHeader: {
      gap: 5,
      width: "50%",
      marginBottom: 10,
    },
    expensesHeader2: {
      gap: 5,
      width: "50%",
      marginBottom: 10,
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    expensesTitle: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.textMuted,
      fontFamily: "Poppins-SemiBold",
    },
    expensesValue: {
      fontSize: 20,
      fontWeight: "400",
      color: colors.text,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    afterElement: {
      height: 10,
      width: "90%",
      backgroundColor: colors.border,
      alignSelf: "center",
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    currentMonthContainer: {
      marginTop: 25,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
      borderRadius: 100,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      gap: 5,
    },
    currentMonth: {
      fontSize: 24,
      color: colors.text,
    },
    currentMonthSeparator: {
      height: 20,
      width: 1,
      backgroundColor: colors.textMuted,
      borderRadius: 100,
    },
    currentYear: {
      fontSize: 24,
      color: colors.text,
    },
    budgetSummaryContainer: {
      marginTop: 25,
    },
    budgetSummaryTitleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: colors.border,
      marginBottom: 5,
    },
    budgetSummaryTitle: {
      fontSize: 16,
      color: colors.textMuted,
      paddingBottom: 10,
    },
    burgetSUmmaryPercent: {
      backgroundColor: colors.surface,
      padding: 10,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: colors.border,
      borderTopEndRadius: 10,
      borderTopStartRadius: 10,
    },
    burgetSUmmaryPercentText: {
      fontSize: 18,
      color: colors.text,
    },
    budgetSummaryContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginTop: 10,
    },
    budgetSummaryContentLeft: {
      width: "50%",
      alignItems: "flex-start",
    },
    budgetSummaryContentRight: {
      width: "50%",
      alignItems: "flex-end",
    },
    budgetSummaryAmountTitle: {
      fontSize: 14,
      color: colors.textMuted,
    },
    budgetSummaryAmountLeft: {
      marginTop: 5,
      fontSize: 18,
      color: colors.expenseMuted,
    },
    budgetSummaryAmountRight: {
      marginTop: 5,
      fontSize: 18,
      color: colors.incomeMuted,
    },
    progressBar: {
      width: "100%",
      height: 10,
      backgroundColor: colors.surface,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      marginTop: 10,
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 50,
    },
    
  });
};

export default createHomeStyles;