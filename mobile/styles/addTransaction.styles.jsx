import { StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";
import { useFontSize } from "../context/fontSizeContext";

const createAddTransactionStyles = () => {
  const { colors } = useTheme();
  const cardRadius = colors?.radii?.card ?? 20;
  const surfaceRadius = colors?.radii?.surface ?? cardRadius;
  const pillRadius = colors?.radii?.pill ?? 12;
  const circleRadius = colors?.radii?.circle ?? 999;
  const { getFontSizeByKey } = useFontSize();
  const fontSize = (key) => getFontSizeByKey(key);

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
      paddingBottom: 15,
    },
    headerTitle: {
      color: colors.text,
      fontSize: fontSize("lg3"),
    },
    controlsContainer: {
      flexDirection: "row",
      gap: 10,
    },
    controls: {
      flex: 1,
      padding: 15,
      borderRadius: circleRadius,
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
      fontSize: fontSize("md"),
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
      borderRadius: circleRadius,
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
      fontSize: fontSize("lg3"),
      color: colors.text,
      flex: 1,
    },
    dateContainer: {
      marginTop: 20,
      padding: 10,
      borderRadius: circleRadius,
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
      fontSize: fontSize("lg3"),
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
      borderRadius: surfaceRadius,
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
      fontSize: fontSize("md"),
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
      borderRadius: pillRadius,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
   },
    categoryText: {
      color: colors.textMuted,
      fontSize: fontSize("md"),
    },
    notesContainer: {
      marginTop: 20,
      padding: 20,
      borderRadius: surfaceRadius,
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
      fontSize: fontSize("md"),
    },
    notesInput: {
      color: colors.text,
      fontSize: fontSize("md"),
      flex: 1,
    },
    saveButton: {
      marginTop: 20,
      width: "90%",
      alignSelf: "center",
      padding: 15,
      borderRadius: circleRadius,
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    saveButtonText: {
      color: colors.surface,
      fontSize: fontSize("lg3"),
      textAlign: "center",
    },
    errorContainer: {
      marginTop: 20,
      padding: 10,
      borderRadius: cardRadius,
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
      fontSize: fontSize("md"),
      textAlign: "center",
    },
  });
};

export default createAddTransactionStyles;