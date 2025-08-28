import { StyleSheet, Dimensions } from "react-native";
import useTheme from "../hooks/useTheme";

const { width, height } = Dimensions.get("window");

const createSettingsStyles = () => {
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 10,
      marginBottom: 10,
    },
    title: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
    },
    clearButton: {
      height: 52,
      borderRadius: 12,
      backgroundColor: colors.danger,
      justifyContent: "center",
      alignItems: "center",
    },
    section: {
        borderRadius: 20,
        padding: 24,
        shadowColor: colors.shadow,
        borderWidth: 1,
        borderColor: colors.border,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4, // elevation is used to create a shadow on the section, in android
        marginBottom: 15,
      },
      sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 20,
        letterSpacing: -0.5,
        color: colors.text,
      },
      sectionTitleDanger: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 20,
        letterSpacing: -0.5,
        color: colors.danger,
      },
      settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      settingLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
      },
      settingIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
      },
      settingText: {
        fontSize: 17,
        fontWeight: "600",
        color: colors.text,
      },
  });
};

export default createSettingsStyles;