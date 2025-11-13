import { StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";

export const banksSummaryStyles = () => {
  const { colors } = useTheme();
  const cardRadius = colors?.radii?.card ?? 20;
  const circleRadius = colors?.radii?.circle ?? 999;

  return StyleSheet.create({
    banksSummaryContainer: {
      flex: 1,
      marginBottom: 10,
      marginTop: 10,
      gap: 10,
      borderWidth: 2,
      borderColor: colors.border,
      padding: 10,
      borderRadius: cardRadius,
      borderStyle: "dashed",
    },
    banksSummaryTitle: {
      marginTop: 25,
      fontSize: 16,
      color: colors.textMuted,
      fontWeight: "bold",
      textAlign: "center",
    },
    bankSummaryItem: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    bankSummaryItemLogo: {
      width: 20,
      height: 20,
      borderRadius: cardRadius,
      marginRight: 10,
    },
    bankSummaryItemName: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "bold",
      flex: 1,
    },
    bankSummaryItemBalance: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "bold",
      textAlign: "right",
      flex: 1,
    },
    banksSummaryEmptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 15,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: circleRadius,
      borderStyle: "dashed",
      padding: 10,
      backgroundColor: colors.surface,
      paddingTop: 25,
      paddingBottom: 25,
    },
    banksSummaryEmptyTitle: {
      fontSize: 14,
      color: colors.textMuted,
    },
  });
};

export default banksSummaryStyles;
