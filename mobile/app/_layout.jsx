import React from "react";
import { Slot } from "expo-router";
import { View } from "react-native";
import { ThemeProvider } from "../hooks/useTheme";
import useTheme from "../hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../components/SafeScreen";
import { UserProvider } from "../context/userContext";

const RootLayout = () => {
  return (
    <UserProvider>
      <ThemeProvider>
        <SafeScreen>
          <Layout />
        </SafeScreen>
      </ThemeProvider>
    </UserProvider>
  );
};

const Layout = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={colors.statusBarStyle} />
      <Slot />
    </View>
  );
};

export default RootLayout;
