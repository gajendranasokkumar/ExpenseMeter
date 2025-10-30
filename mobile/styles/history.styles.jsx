import { StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";

const createHistoryStyles = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 16,
      paddingBottom: 0,
    },
    controlsContainer: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 16,
    },
    controls: {
      flex: 1,
      padding: 15,
      borderRadius: 100,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    controlsIcon: {
      marginRight: 5,
    },
    controlsTitle: {
      color: colors.textMuted,
      fontSize: 16,
    },
    controlsActive: {
      backgroundColor: colors.surface,
      borderColor: colors.primary,
    },
    controlsActiveText: {
      color: colors.primary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 24,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 24,
      paddingBottom: 24,
    },
    footerText: {
      color: colors.textMuted,
      fontSize: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    emptyIconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      color: colors.textMuted,
      marginTop: 24,
      fontSize: 16,
    },
    transactionContainer: {
      // flexDirection: 'row',
      // justifyContent: 'space-between',
      // alignItems: 'center',
      marginBottom: 10,
      padding: 4,
      paddingBottom: 5,
      backgroundColor: colors.surface,
      borderRadius: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      elevation: 2,
    },
    transactionContainerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    transactionLeft: {
      width: 50,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
      borderRightWidth: 1,
      borderRightColor: colors.border,
    },
    transactionCenter: {
      flex: 1,
    },
    transactionCenterTitle: {
      fontSize: 16,
      color: colors.text,
    },
    transactionRight: {
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    transactionRightAmount: {
      fontSize: 16,
    },
    transactionCenterDate: {
      fontSize: 12,
      color: colors.textMuted,
    },
    optionsIcon: {
      color: colors.primary,
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 10,
    },
    info: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
      padding: 16,
      paddingVertical: 8,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.warning,
    },
    infoText: {
      color: colors.textMuted,
      fontSize: 12,
    },
    infoIcon: {
      color: colors.warning,
    },
  });
};

export default createHistoryStyles;