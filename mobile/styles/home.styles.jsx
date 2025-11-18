import { StyleSheet, Dimensions } from "react-native";
import useTheme from "../hooks/useTheme";
import { useFontSize } from "../context/fontSizeContext";

const { width, height } = Dimensions.get("window");

const createHomeStyles = () => {
  const { colors } = useTheme();
  const { getFontSizeByKey } = useFontSize();
  const fontSize = (key) => getFontSizeByKey(key);
  const cardRadius = colors?.radii?.card ?? 20;
  const surfaceRadius = colors?.radii?.surface ?? cardRadius;
  const buttonRadius = colors?.radii?.button ?? 16;
  const pillRadius = colors?.radii?.pill ?? 12;
  const circleRadius = colors?.radii?.circle ?? 999;
  const modalRadius = colors?.radii?.modal ?? surfaceRadius;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 16,
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
      borderRadius: circleRadius,
    },
    headerIcon: {
      color: colors.primary,
      backgroundColor: colors.surface,
      padding: 10,
      borderRadius: pillRadius,
    },
    headerTitle: {
      color: colors.text,
      fontSize: fontSize("lg3"),
      fontWeight: "700",
    },
    headerSubtitle: {
      color: colors.textMuted,
      fontSize: fontSize("base"),
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
      borderRadius: pillRadius,
      padding: 10,
      position: "relative",
    },
    notificationIconText: {
      fontSize: fontSize("xs"),
      height: 12,
      width: 12,
      position: "absolute",
      top: -2,
      right: -2,
      backgroundColor: colors.danger,
      borderRadius: circleRadius,
      padding: 1,
      zIndex: 1,
      shadowColor: colors.danger,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    addButton: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: buttonRadius,
    },
    statsContainer: {
      backgroundColor: colors.surface,
      padding: 15,
      paddingHorizontal: 20,
      borderRadius: surfaceRadius,
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
      fontSize: fontSize("md"),
      fontWeight: "400",
      color: colors.textMuted,
    },
    mainBalanceValue: {
      fontSize: fontSize("xl"),
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
      fontSize: fontSize("base"),
      fontWeight: "400",
      color: colors.textMuted,
      fontFamily: "Poppins-SemiBold",
    },
    expensesValue: {
      fontSize: fontSize("lg"),
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
      borderBottomRightRadius: surfaceRadius,
      borderBottomLeftRadius: surfaceRadius,
    },
    currentMonthContainer: {
      marginTop: 25,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
      borderRadius: circleRadius,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      gap: 5,
    },
    currentMonth: {
      fontSize: fontSize("lg3"),
      color: colors.text,
    },
    currentMonthSeparator: {
      height: 20,
      width: 1,
      backgroundColor: colors.textMuted,
      borderRadius: pillRadius,
    },
    currentYear: {
      fontSize: fontSize("lg3"),
      color: colors.text,
    },
    budgetSummaryContainer: {
      marginTop: 35,
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
      fontSize: fontSize("md"),
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
      fontSize: fontSize("md3"),
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
      fontSize: fontSize("base"),
      color: colors.textMuted,
    },
    budgetSummaryAmountLeft: {
      marginTop: 5,
      fontSize: fontSize("md3"),
      color: colors.expenseMuted,
    },
    budgetSummaryAmountRight: {
      marginTop: 5,
      fontSize: fontSize("md3"),
      color: colors.incomeMuted,
    },
    progressBar: {
      width: "100%",
      height: 10,
      backgroundColor: colors.surface,
      borderRadius: pillRadius,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      marginTop: 10,
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: pillRadius,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "flex-end",
    },
    notificationModal: {
      height: height * 0.9,
      width: "100%",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      borderTopLeftRadius: modalRadius,
      borderTopRightRadius: modalRadius,
    },
    notificationModalContent: {
      flex: 1,
      backgroundColor: colors.surface,
      borderTopLeftRadius: surfaceRadius,
      borderTopRightRadius: surfaceRadius,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 20,
    },
    notificationModalContentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderColor: colors.border,
      marginBottom: 10,
    },
    notificationModalContentHeaderTitle: {
      fontSize: fontSize("lg"),
      color: colors.text,
    },
    notificationModalContentHeaderClose: {
      padding: 5,
      borderRadius: pillRadius,
      backgroundColor: colors.backgrounds.error,
    },
    notificationModalContentEmptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 15,
    },
    notificationModalContentEmpty: {
      fontSize: fontSize("md"),
      color: colors.textMuted,
      textAlign: "center",
    },
    notificationModalContentFooter: {
      padding: 10,
    },
    notificationModalContentFooterText: {
      fontSize: fontSize("md"),
      color: colors.textMuted,
      textAlign: "center",
    },
    notificationItemContainer: {
      padding: 10,
      marginBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      borderRadius: pillRadius,
    },
    newNotificationItemContainer: {
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      backgroundColor: colors.bg,
    },
    notificationItemTitle: {
      fontSize: fontSize("md"),
      color: colors.text,
    },
    notificationItemMessage: {
      fontSize: fontSize("base"),
      color: colors.textMuted,
      marginBottom: 3,
    },
    notificationItemCreatedAt: {
      fontSize: fontSize("sm"),
      color: colors.textMuted,
      textAlign: "right",
    },
    info: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
      padding: 16,
      paddingVertical: 8,
      backgroundColor: colors.bg,
      borderRadius: surfaceRadius,
      borderLeftWidth: 4,
      borderLeftColor: colors.warning,
    },
    infoText: {
      color: colors.textMuted,
      fontSize: fontSize("sm"),
    },
    infoIcon: {
      color: colors.warning,
    },
    deleteAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 16,
      backgroundColor: colors.danger,
      padding: 10,
      borderRadius: buttonRadius,
    },
    deleteAllButtonText: {
      color: colors.text,
      fontSize: fontSize("base"),
    },
    budgetFailureTitleContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginTop: 10,
      borderWidth: 2,
      borderColor: colors.border,
      padding: 20,
      borderRadius: cardRadius,
      backgroundColor: colors.surface,
      borderStyle: 'dashed',
    },
    budgetFailureTitle: {
      color: colors.textMuted,
      fontSize: fontSize("md"),
      textAlign: 'center',
    },
    budgetFailureTitleButton: {
      color: colors.primary,
      fontSize: fontSize("md"),
      textAlign: 'center',
      marginTop: 15,
      textDecorationLine: 'underline',
    },
    remainingBudgetContainer: {
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 15,
    },
    remainingBudgetTitle: {
      marginBottom: 5,
      fontSize: fontSize("base"),
      textAlign: 'center',
      color: colors.textMuted,
    },
    remainingBudgetAmount: {
      fontSize: fontSize("base"),
      color: colors.text,
      textDecorationLine: 'underline',
    },
    arrowDownIcon: {
      marginTop: 10,
      color: colors.textMuted,
      alignSelf: "center",
    },
  });
};

export default createHomeStyles;