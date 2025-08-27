import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../hooks/useTheme"; 

const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: colors.bg }}>
      {children}
    </View>
  );
};

export default SafeScreen;