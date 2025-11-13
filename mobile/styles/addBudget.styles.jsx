import { StyleSheet } from "react-native";

const createStyles = (colors) => {
  const inputRadius = colors?.radii?.input ?? 16;
  const buttonRadius = colors?.radii?.button ?? 16;
  const pillRadius = colors?.radii?.pill ?? 12;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    scrollContent: {
      paddingBottom: 50,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    header: {
      marginBottom: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
      borderBottomWidth: 1,
      borderColor: colors.border,
      paddingBottom: 15,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 24,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: inputRadius,
      padding: 16,
      color: colors.text,
      fontSize: 16,
    },
    dateInputContainer: {
      marginBottom: 20,
    },
    dateInputButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: inputRadius,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    dateInputText: {
      fontSize: 16,
    },
    dateInputTextPlaceholder: {
      color: colors.textMuted,
    },
    dateInputTextFilled: {
      color: colors.text,
    },
    categoryContainer: {
      marginBottom: 20,
    },
    categoryScrollView: {
      flexDirection: "row",
      gap: 12,
    },
    categoryButton: {
      borderWidth: 1,
      borderRadius: pillRadius,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    categoryButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryButtonUnselected: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    categoryButtonText: {
      fontSize: 14,
      fontWeight: "500",
    },
    categoryButtonTextSelected: {
      color: colors.surface,
    },
    categoryButtonTextUnselected: {
      color: colors.text,
    },
    periodContainer: {
      marginBottom: 20,
    },
    periodButtonRow: {
      flexDirection: "row",
      gap: 12,
    },
    periodButton: {
      flex: 1,
      borderWidth: 1,
      borderRadius: buttonRadius,
      padding: 16,
      alignItems: "center",
    },
    periodButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    periodButtonUnselected: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    periodButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    periodButtonTextSelected: {
      color: colors.surface,
    },
    periodButtonTextUnselected: {
      color: colors.text,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: buttonRadius,
      padding: 16,
      alignItems: "center",
      marginTop: 20,
    },
    submitButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: "700",
    },
  });
};

export default createStyles;
