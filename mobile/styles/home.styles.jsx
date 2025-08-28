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

  });
};

export default createHomeStyles;