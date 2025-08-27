import { StyleSheet, Dimensions } from "react-native";
import useTheme from "../hooks/useTheme";

const { width, height } = Dimensions.get("window");

const createHomeStyles = () => {
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
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 10,
    },
    title: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
    },
    addButton: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 10,
    },
  });
};

export default createHomeStyles;