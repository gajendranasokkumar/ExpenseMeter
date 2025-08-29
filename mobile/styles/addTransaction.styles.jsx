import { StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";

const createAddTransactionStyles = () => {
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
      paddingBottom: 15,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 24,
    },
    controlsContainer: {
      flexDirection: "row",
      gap: 10,
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
      marginRight: 10,
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
    amountInputContainer: {
      marginTop: 20,
      padding: 10,
      borderRadius: 100,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
    },
    amountInputIcon: {
      margin: 10,
    },
    amountInput: {
      fontSize: 24,
      color: colors.text,
      flex: 1,
    },
    dateContainer: {
      marginTop: 20,
      padding: 10,
      borderRadius: 100,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
    },
    dateIcon: {
      margin: 10,
    },
    dateText: {
      fontSize: 24,
      color: colors.text,
      flex: 1,
    },
    dateButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    categoriesContainer: {
      marginTop: 20,
      padding: 20,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoriesHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderColor: colors.border,
      paddingBottom: 10,
    },
    categoriesHeaderText: {
      color: colors.text,
      fontSize: 16,
    },
    categoriesList: {
      marginTop: 10,
      gap: 10,
      flexDirection: "row",
      flexWrap: "wrap",
    },
    category: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderRadius: 100,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
   },
    categoryText: {
      color: colors.textMuted,
      fontSize: 16,
    },
    notesContainer: {
      marginTop: 20,
      padding: 20,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    notesHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderColor: colors.border,
      paddingBottom: 10,
    },
    notesHeaderText: {
      color: colors.text,
      fontSize: 16,
    },
    notesInput: {
      color: colors.text,
      fontSize: 16,
      flex: 1,
    },
    saveButton: {
      marginTop: 20,
      width: "90%",
      alignSelf: "center",
      padding: 15,
      borderRadius: 100,
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
    errorContainer: {
      marginTop: 20,
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.backgrounds.error,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      justifyContent: "center",
      borderLeftWidth: 5,
      borderLeftColor: colors.danger,
    },
    errorText: {
      color: colors.danger,
      fontSize: 16,
      textAlign: "center",
    },
  });
};

export default createAddTransactionStyles;