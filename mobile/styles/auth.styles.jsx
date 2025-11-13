import { StyleSheet, Dimensions } from "react-native";
import useTheme from "../hooks/useTheme";

const { width, height } = Dimensions.get("window");

const createAuthStyles = () => {
  const { colors } = useTheme();
  const cardRadius = colors?.radii?.card ?? 20;
  const inputRadius = colors?.radii?.input ?? 16;
  const buttonRadius = colors?.radii?.button ?? 16;

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.bg,
      paddingHorizontal: 20,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: colors.textMuted,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 40,
    },
    // Error banner styles
    errorBanner: {
      width: "100%",
      maxWidth: 360,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: cardRadius,
      backgroundColor: "#FFE5E5",
      borderLeftWidth: 4,
      borderLeftColor: colors.danger,
      marginBottom: 16,
    },
    errorBannerText: {
      color: colors.danger,
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
    },
    formContainer: {
      width: "100%",
      maxWidth: 320,
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
      marginLeft: 4,
    },
    input: {
      width: "100%",
      height: 52,
      borderColor: colors.border,
      borderWidth: 1.5,
      borderRadius: inputRadius,
      paddingHorizontal: 16,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.backgrounds.input,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      marginBottom: 15,
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    inputPlaceholder: {
      color: colors.textMuted,
      fontSize: 16,
      fontWeight: "500",
    },
    inputFocused: {
      borderColor: colors.primary,
      borderWidth: 2,
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 8,
    },
    inputError: {
      borderColor: colors.danger,
      borderWidth: 2,
    },
    errorText: {
      color: colors.danger,
      fontSize: 12,
      marginTop: 6,
      marginLeft: 4,
    },
    forgotPasswordContainer: {
      alignSelf: "flex-end",
      marginBottom: 24,
    },
    forgotPasswordText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "500",
    },
    button: {
      width: "100%",
      height: 52,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: buttonRadius,
      marginTop: 8,
      marginBottom: 15,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    buttonPressed: {
      backgroundColor: colors.gradients.primary[1],
      transform: [{ scale: 0.98 }],
    },
    buttonDisabled: {
      backgroundColor: colors.textMuted,
      opacity: 0.6,
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
      letterSpacing: 0.5,
      textAlign: "center",
    },
    buttonTextDisabled: {
      color: colors.textMuted,
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 30,
      width: "100%",
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      color: colors.textMuted,
      fontSize: 14,
      marginHorizontal: 16,
    },
    socialButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 20,
    },
    socialButton: {
      flex: 1,
      height: 48,
      borderColor: colors.border,
      borderWidth: 1.5,
      borderRadius: buttonRadius,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 6,
      backgroundColor: colors.surface,
    },
    socialButtonText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "500",
    },
    signupContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 30,
    },
    signupText: {
      color: colors.textMuted,
      fontSize: 14,
    },
    signupLink: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 4,
    },
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.bg,
      opacity: 0.8,
    },
    // Responsive adjustments
    responsiveContainer: {
      paddingHorizontal: width > 400 ? 32 : 20,
    },
    responsiveTitle: {
      fontSize: width > 400 ? 36 : 32,
    },
    responsiveInput: {
      height: width > 400 ? 56 : 52,
    },
    responsiveButton: {
      height: width > 400 ? 56 : 52,
    },
    linkText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textMuted,
    },
    link: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    linkContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
  });
};

export default createAuthStyles;
