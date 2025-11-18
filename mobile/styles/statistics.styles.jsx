import { StyleSheet, Dimensions } from "react-native";
import useTheme from "../hooks/useTheme";
import { useFontSize } from "../context/fontSizeContext";

const { width } = Dimensions.get("window");

const createStatisticsStyles = () => {
  const CELL_WIDTH = width / 7;

  const { colors } = useTheme();
  const surfaceRadius = colors?.radii?.surface ?? (colors?.radii?.card ?? 20);
  const pillRadius = colors?.radii?.pill ?? 12;
  const { getFontSizeByKey } = useFontSize();
  const fontSize = (key) => getFontSizeByKey(key);
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    header: {
      marginBottom: 20,
    },
    title: {
      fontSize: fontSize("xl"),
      fontWeight: "bold",
      color: colors.text,
      paddingHorizontal: 16,
    },
    monthsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
      paddingHorizontal: 10,
    },
    tabsSelectorContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    tabsSelectorItem: {
      flexGrow: 1,
      padding: 16,
    },
    tabName: {
      color: colors.textMuted,
      textAlign: "center",
    },
    activeTabsSelectorItem: {
      borderBottomWidth: 3,
      flexGrow: 1,
      padding: 16,
      borderColor: colors.primary,
    },
    activeTabName: {
      color: colors.primary,
      textAlign: "center",
      fontSize: fontSize("md"),
      fontWeight: "600",
    },


    // DailyStats styles starts here 
    topExpenseContainer: {
      flexDirection: "row",
    },
    topExpenseDataContainer: {
      flex: 1,
      padding: 10,
      paddingHorizontal: 20,
      backgroundColor: colors.bg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border
    },
    topExpenseDataHeading: {
      fontSize: fontSize("base"),
      color: colors.text,
      marginBottom: 5,
    },
    topExpenseDataValue: {
      fontSize: fontSize("lg"),
      color: colors.expense,
      textAlign: "center",
    },
    wrapper: {
      alignItems: "center",
      paddingVertical: 20,
      backgroundColor: "transparent",
    },
    chartWrapper: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    legendContainer: {
      marginTop: 10,
      width: "100%",
      padding: 15,
      marginBottom: 30
    },
    legendRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 2,
    },
    legendColorCol: {
      width: 30,
      alignItems: "left",
    },
    legendColorBox: {
      width: 20,
      height: 16,
      borderRadius: pillRadius,
    },
    legendLabelCol: {
      paddingLeft: 5,
      flex: 1,
    },
    legendValueCol: {
      alignItems: "flex-end",
    },
    legendLabel: {
      fontSize: fontSize("base"),
    },
    legendValue: {
      fontSize: fontSize("base"),
    },

    // MonthlyStats Styles starts here

    scrollView: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      fontSize: fontSize("lg3"),
      textAlign: "center",
      marginVertical: 16,
      color: "#ffffff",
      letterSpacing: 0.5,
    },
    weekHeader: {
      flexDirection: "row",
      marginBottom: 0,
      backgroundColor: colors.bg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    weekDayContainer: {
      width: CELL_WIDTH,
      alignItems: "center",
      paddingVertical: 12,
      borderRightWidth: 1,
      borderRightColor: colors.border,
    },
    weekDay: {
      fontSize: fontSize("base"),
      fontWeight: "600",
      color: colors.text,
      textTransform: "capitalize",
      letterSpacing: 0.3,
    },
    calendarGrid: {
      gap: 0,
    },
    weekRow: {
      flexDirection: "row",
      gap: 0,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    cell: {
      width: CELL_WIDTH,
      minHeight: 120,
      backgroundColor: colors.surface,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      padding: 3,
      borderRightWidth: 1,
      borderRightColor: colors.border,
    },
    activeCell: {
      backgroundColor: colors.surface,
    },
    emptyCell: {
      width: CELL_WIDTH,
      minHeight: 120,
      backgroundColor: colors.bg,
      borderRightWidth: 1,
      borderRightColor: colors.border,
    },
    dayText: {
      fontSize: fontSize("sm"),
      color: colors.text,
      marginBottom: 8,
    },
    activeDayText: {
      color: colors.text,
    },
    infoText: {
      fontSize: fontSize("xs"),
      color: colors.primary,
      lineHeight: 20,
    },
    budgetListContainer: {
      padding: 15,
      paddingBottom: 50,
      backgroundColor: colors.bg,
    },
    budgetListHeading: {
      backgroundColor: colors.surface,
      padding: 10,
      textAlign: "center",
      color: colors.text,
      fontSize: fontSize("lg"),
      marginBottom: 15,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: surfaceRadius
    },
    pieChartHeadingContainer: {
      backgroundColor: colors.bg,
      paddingHorizontal: 15,
      paddingTop: 15
    }
  });
};

export default createStatisticsStyles;
