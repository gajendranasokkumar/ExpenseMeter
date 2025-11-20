import { StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";
import { useFontSize } from "../context/fontSizeContext";

const createExportDataStyles = () => {
  const { colors } = useTheme();
  const { getFontSizeByKey } = useFontSize();
  const fontSize = (key) => getFontSizeByKey(key);
  const cardRadius = colors?.radii?.card ?? 20;
  const buttonRadius = colors?.radii?.button ?? 16;

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: buttonRadius,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      flex: 1,
      color: colors.text,
      fontSize: fontSize("xl"),
      fontWeight: "700",
      paddingLeft: 16,
    },
    spacer: {
      width: 44,
      height: 44,
    },
    description: {
      fontSize: fontSize("base"),
      color: colors.textMuted,
      marginBottom: 20,
      lineHeight: 20,
    },
    card: {
      borderRadius: cardRadius,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 20,
      backgroundColor: colors.surface,
      marginBottom: 16,
    },
    label: {
      fontSize: fontSize("sm2"),
      color: colors.textMuted,
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: 0.7,
      fontWeight: "600",
    },
    metaValue: {
      fontSize: fontSize("lg"),
      color: colors.text,
      fontWeight: "700",
    },
    button: {
      borderRadius: buttonRadius,
      paddingVertical: 16,
      paddingHorizontal: 18,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12,
      flexDirection: "row",
    },
    buttonText: {
      fontSize: fontSize("md"),
      fontWeight: "600",
      color: "#fff",
      marginLeft: 8,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: buttonRadius,
      paddingHorizontal: 14,
      paddingVertical: 14,
      fontSize: fontSize("md"),
      color: colors.text,
      backgroundColor: colors.backgrounds?.input ?? colors.surface,
      marginTop: 8,
    },
    inputLabel: {
      fontSize: fontSize("sm2"),
      color: colors.textMuted,
      fontWeight: "600",
      marginTop: 8,
    },
    hint: {
      fontSize: fontSize("xs"),
      color: colors.textMuted,
      marginTop: 4,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    statValue: {
      fontSize: fontSize("lg"),
      fontWeight: "700",
      color: colors.text,
    },
    statLabel: {
      fontSize: fontSize("sm2"),
      color: colors.textMuted,
      marginTop: 2,
    },
    statusPill: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: buttonRadius,
      backgroundColor: colors.backgrounds?.chip ?? colors.surface,
      marginTop: 6,
    },
    statusText: {
      fontSize: fontSize("xs"),
      fontWeight: "600",
      color: colors.textMuted,
    },
  });
};

export default createExportDataStyles;


