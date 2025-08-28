import React from "react";
import { Tabs } from "expo-router";
import useTheme from "../../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, View } from "react-native";

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
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
          paddingTop: 10,
          paddingBottom: insets.bottom,
          height: 70 + insets.bottom,
        },
        sceneContainerStyle: {
          backgroundColor: colors.bg, // ensure scene matches
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: "600",
        },
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "timer" : "timer-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addTransaction"
        options={{
          title: "New",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
