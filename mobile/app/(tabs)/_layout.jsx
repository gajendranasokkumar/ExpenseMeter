import React, { useState } from "react";
import { Tabs, router, usePathname } from "expo-router";
import useTheme from "../../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, View } from "react-native";
import SelectionModal from "../../components/SelectionModal";

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const pathname = usePathname();

  // Check if we're on addTransaction or addBudget screen
  const isNewTabActive =
    pathname === "/(tabs)/addTransaction" ||
    pathname === "/(tabs)/addBudget" ||
    pathname.includes("/addTransaction") ||
    pathname.includes("/addBudget");

  const handleTransactionPress = () => {
    router.push("/(tabs)/addTransaction");
  };

  const handleBudgetPress = () => {
    router.push("/(tabs)/addBudget");
  };

  return (
    <>
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
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "timer" : "timer-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="addTransaction"
          options={{
            title: "New",
            tabBarIcon: ({ color, size, focused }) => {
              const iconName = isNewTabActive
                ? "add-circle"
                : "add-circle-outline";
              const iconColor = isNewTabActive
                ? colors.primary
                : colors.textMuted;

              return (
                <Pressable onPress={() => setShowSelectionModal(true)}>
                  <Ionicons name={iconName} size={size} color={iconColor} />
                </Pressable>
              );
            },
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setShowSelectionModal(true);
            },
          }}
        />
        <Tabs.Screen
          name="banks"
          options={{
            title: "Banks",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "card" : "card-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="addBudget"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>

      <SelectionModal
        visible={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        onSelectTransaction={handleTransactionPress}
        onSelectBudget={handleBudgetPress}
      />
    </>
  );
};

export default TabsLayout;
