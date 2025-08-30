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
      paddingBottom: 0,
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
      marginBottom: 15,
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
      color: colors.text,
    },
    sectionTitleDanger: {
      fontSize: 20,
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
    profileSectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 25,
      borderBottomWidth: 1,
      borderColor: colors.border,
      paddingBottom: 5,
    },
    profileSectionEditButton: {
      padding: 10,
      borderRadius: 8,
      fontWeight: "700",
    },
    profileSectionEditButtonIcon: {
      width: 24,
      height: 24,
    },
    profileSectionName: {
      fontSize: 20,
      color: colors.text,
    },
    profileSectionEmail: {
      fontSize: 16,
      color: colors.textMuted,
    },
    profileSectionNameContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    profileSectionEmailContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    profileSection: {
      width: "100%",
    },
    profileSectionAvatar: {
      width: 150,
      height: 150,
      borderRadius: 16,
      marginBottom: 15,
      borderWidth: 2,
      borderColor: colors.textMuted,
      alignSelf: "center",
    },
    avatarEditButtonContainer: {
      position: "absolute",
      top: -10,
      right: 60,
      backgroundColor: colors.surface,
      borderRadius: 100,
      padding: 5,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      zIndex: 1,
      borderWidth: 1,
      borderColor: colors.textMuted,
    },
    avatarDeleteButtonContainer: {
      position: "absolute",
      top: -10,
      left: 60,
      backgroundColor: colors.danger,
      borderRadius: 100,
      padding: 5,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      zIndex: 1,
      borderWidth: 1,
      borderColor: colors.danger,
    },
    profileSectionEditButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    profileSectionName: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 5,
    },
    profileSectionEmail: {
      fontSize: 18,
      color: colors.textMuted,
    },
    profileSectionNameEditable: {
      color: colors.text,
      borderBottomWidth: 1,
      borderBottomColor: colors.text,
    },
  });
};

export default createSettingsStyles;