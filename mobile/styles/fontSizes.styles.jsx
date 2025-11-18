import { StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";
import { useFontSize } from "../context/fontSizeContext";

const createFontSizesStyles = () => {
  const { colors } = useTheme();
  const cardRadius = colors?.radii?.card ?? 20;
  const surfaceRadius = colors?.radii?.surface ?? cardRadius;
  const buttonRadius = colors?.radii?.button ?? 16;
  const pillRadius = colors?.radii?.pill ?? 12;
  const { getFontSizeByKey } = useFontSize();
  const fontSize = (key) => getFontSizeByKey(key);

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
    title: {
      flex: 1,
      color: colors.text,
      fontSize: fontSize("xl"),
      fontWeight: "700",
      paddingLeft: 16,
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
    spacer: {
      width: 44,
      height: 44,
    },
    description: {
      fontSize: fontSize("base"),
      color: colors.textMuted,
      marginBottom: 16,
    },
    content: {
      paddingBottom: 32,
    },
    card: {
      borderRadius: surfaceRadius,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: 20,
      marginBottom: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    previewTitle: {
      color: colors.text,
      fontWeight: "700",
      marginBottom: 6,
    },
    previewSubtitle: {
      color: colors.textMuted,
      marginBottom: 12,
    },
    previewBody: {
      color: colors.text,
      marginBottom: 8,
    },
    previewCaption: {
      color: colors.textMuted,
    },
    previewMeta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 16,
    },
    scaleBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: pillRadius,
      backgroundColor: colors.backgrounds?.input ?? colors.bg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    scaleBadgeText: {
      fontSize: fontSize("sm2"),
      color: colors.text,
      fontWeight: "600",
    },
    sliderCard: {
      borderRadius: surfaceRadius,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: 20,
      marginBottom: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    sliderHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    sliderLabel: {
      fontSize: fontSize("base"),
      color: colors.textMuted,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    sliderValue: {
      fontSize: fontSize("md"),
      color: colors.text,
      fontWeight: "700",
    },
    sliderControl: {
      width: "100%",
      marginTop: 8,
    },
    sliderLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    sliderLabelText: {
      fontSize: fontSize("sm"),
      color: colors.textMuted,
      textAlign: "center",
    },
    sliderLabelActive: {
      color: colors.primary,
      fontWeight: "600",
    },
    helperText: {
      textAlign: "center",
      fontSize: fontSize("sm2"),
      color: colors.textMuted,
      marginTop: 12,
    },
    legend: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 16,
    },
    legendItem: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: pillRadius,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgrounds?.input ?? colors.bg,
      marginRight: 8,
      marginBottom: 8,
    },
    legendText: {
      fontSize: fontSize("sm"),
      color: colors.textMuted,
    },
    loadingState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
};

export default createFontSizesStyles;

