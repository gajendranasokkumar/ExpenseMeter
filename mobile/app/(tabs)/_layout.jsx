import React from "react";
import { Tabs } from "expo-router";
import useTheme from "../../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

const TabsLayout = () => {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface, // match screen bg to avoid seam
          borderTopWidth: 0.5, // force no border
          borderTopColor: colors.border,
          elevation: 0, // Android shadow
          shadowOpacity: 0, // iOS shadow
          shadowColor: "transparent",
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
        },
        sceneContainerStyle: {
          backgroundColor: colors.bg, // ensure scene matches
        },
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
