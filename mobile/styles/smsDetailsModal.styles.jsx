import { StyleSheet, Dimensions } from "react-native";
import useTheme from "../hooks/useTheme";

const { width, height } = Dimensions.get("window");

const createSmsDetailsModalStyles = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    modalCenterOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    smsDetailsModal: {
      maxHeight: height * 0.8,
      width: Math.min(width - 48, 560),
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 12,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: colors.surface,
    },
    smsDetailsModalContent: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 280,
    },
    smsDetailsModalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    smsDetailsModalHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    smsDetailsModalHeaderTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    smsDetailsModalHeaderClose: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.bg,
    },
    smsDetailsModalBody: {
      flex: 1,
      padding: 20,
    },
    smsDetailsSection: {
      marginBottom: 25,
    },
    smsDetailsSectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 15,
    },
    smsDetailsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 15,
      backgroundColor: colors.bg,
      borderRadius: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    smsDetailsRowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
    },
    smsDetailsRowLabel: {
      fontSize: 14,
      color: colors.textMuted,
      fontWeight: "500",
    },
    smsDetailsRowValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "600",
      textAlign: "right",
    },
    smsDetailsMessageContainer: {
      backgroundColor: colors.bg,
      padding: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    smsDetailsMessageText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    smsDetailsEmptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 15,
    },
    smsDetailsEmptyText: {
      fontSize: 16,
      color: colors.textMuted,
      textAlign: "center",
      fontWeight: "500",
    },
    smsDetailsEmptySubtext: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: "center",
    },
    smsDetailsModalFooter: {
      padding: 20,
      paddingTop: 15,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    smsDetailsModalButton: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    smsDetailsModalButtonPrimary: {
      backgroundColor: colors.primary,
    },
    smsDetailsModalButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
  });
};

export default createSmsDetailsModalStyles;


