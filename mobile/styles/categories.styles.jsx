import { StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";

const createCategoriesStyles = () => {
  const { colors } = useTheme();
  const cardRadius = colors?.radii?.card ?? 20;
  const surfaceRadius = colors?.radii?.surface ?? cardRadius;
  const buttonRadius = colors?.radii?.button ?? 16;
  const pillRadius = colors?.radii?.pill ?? 12;
  const circleRadius = colors?.radii?.circle ?? 999;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 10,
      marginBottom: 10,
    },
    title: {
      flex: 1,
      color: colors.text,
      fontSize: 28,
      fontWeight: "700",
      paddingLeft: 16,
    },
    headerSpacer: {
      width: 44,
      height: 44,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    section: {
      borderRadius: surfaceRadius,
      padding: 15,
      shadowColor: colors.shadow,
      borderWidth: 1,
      borderColor: colors.border,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      marginBottom: 15,
    },
    categoryListItem: {
      marginBottom: 12,
    },
    categoryCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      borderRadius: surfaceRadius,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      backgroundColor: colors.surface,
    },
    categoryLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    categoryIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.backgrounds.input,
      alignItems: "center",
      justifyContent: "center",
    },
    categoryText: {
      flex: 1,
    },
    categoryName: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "600",
      marginBottom: 4,
    },
    categoryRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginLeft: 12,
    },
    chevronWrap: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 6,
      borderRadius: pillRadius,
    },
    chevronWrapExpanded: {
      transform: [{ rotate: "180deg" }],
    },
    expandedContainer: {
      marginHorizontal: 12,
      marginTop: -2,
      zIndex: -1,
      padding: 12,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderRadius: surfaceRadius,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
      width: "90%",
      alignSelf: "center",
    },
    expandedActions: {
      flexDirection: "row",
      gap: 4,
    },
    deleteButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.danger,
      paddingVertical: 10,
      borderRadius: buttonRadius,
    },
    editButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      paddingVertical: 10,
      borderRadius: buttonRadius,
    },
    deleteButtonText: {
      color: colors.surface,
      fontSize: 14,
      fontWeight: "600",
    },
    editButtonText: {
      color: colors.surface,
      fontSize: 14,
      fontWeight: "600",
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    detailLabel: {
      color: colors.textMuted,
      fontSize: 12,
    },
    detailValue: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "500",
    },
    emptyText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "600",
      textAlign: "center",
    },
    formContainer: {
      marginBottom: 20,
    },
    formTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    input: {
      backgroundColor: colors.backgrounds.input,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    iconSelectorButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.backgrounds.input,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    iconSelectorButtonText: {
      fontSize: 16,
      color: colors.text,
    },
    colorSelectorButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.backgrounds.input,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    colorSelectorButtonText: {
      fontSize: 16,
      color: colors.text,
    },
    colorPreview: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
    },
    saveButton: {
      marginTop: 20,
      width: "70%",
      alignSelf: "center",
      padding: 8,
      borderRadius: circleRadius,
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    saveButtonText: {
      color: colors.surface,
      fontSize: 24,
      textAlign: "center",
    },
    footer: {
      paddingVertical: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    footerText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "600",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: surfaceRadius,
      padding: 20,
      width: "90%",
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
      marginTop: 20,
    },
    modalButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: buttonRadius,
    },
    modalButtonCancel: {
      backgroundColor: colors.backgrounds.input,
    },
    modalButtonConfirm: {
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    modalButtonTextCancel: {
      color: colors.text,
    },
    modalButtonTextConfirm: {
      color: colors.surface,
    },
  });
};

export default createCategoriesStyles;

