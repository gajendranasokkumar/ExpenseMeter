import { StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";
import { useFontSize } from "../context/fontSizeContext";

const createMoreStyles = () => {
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
      marginBottom: 24,
    },
    masterTitle: {
      flex: 1,
      color: colors.text,
      fontSize: fontSize("xl"),
      fontWeight: "700",
    },
    title: {
      flex: 1,
      color: colors.text,
      fontSize: fontSize("xl"),
      fontWeight: "700",
      paddingLeft: 16,
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: fontSize("base"),
      marginTop: 8,
      textAlign: "center",
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
    listContent: {
      paddingBottom: 40,
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: fontSize("sm2"),
      fontWeight: "700",
      color: colors.textMuted,
      marginBottom: 12,
      letterSpacing: 0.6,
      textTransform: "uppercase",
    },
    optionCard: {
      marginBottom: 14,
      borderRadius: cardRadius,
      overflow: "hidden",
    },
    optionInner: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: cardRadius,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 18,
      paddingHorizontal: 18,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    iconContainer: {
      width: 46,
      height: 46,
      borderRadius: pillRadius,
      marginRight: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgrounds?.input ?? colors.surface,
    },
    optionTextWrapper: {
      flex: 1,
    },
    optionTitle: {
      fontSize: fontSize("md"),
      fontWeight: "600",
      color: colors.text,
    },
    optionDescription: {
      fontSize: fontSize("sm2"),
      color: colors.textMuted,
      marginTop: 4,
    },
    trailing: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 12,
    },
    trailingText: {
      fontSize: fontSize("sm2"),
      color: colors.textMuted,
      marginRight: 8,
      fontWeight: "600",
    },
    screenContent: {
      paddingBottom: 32,
    },
    surfaceCard: {
      borderRadius: surfaceRadius,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: 4,
      paddingVertical: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    listRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    listRowTitle: {
      fontSize: fontSize("md"),
      color: colors.text,
      fontWeight: "600",
    },
    listRowSubtitle: {
      fontSize: fontSize("sm2"),
      color: colors.textMuted,
      marginTop: 4,
    },
    rowIcon: {
      marginRight: 12,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
      opacity: 0.5,
    },
    sectionDescription: {
      fontSize: fontSize("base"),
      color: colors.textMuted,
      marginBottom: 16,
    },
  });
};

export default createMoreStyles;
