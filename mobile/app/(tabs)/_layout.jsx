import React, { useState } from "react";
import { Tabs, router } from "expo-router";
import useTheme from "../../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, TouchableOpacity } from "react-native";
import SelectionModal from "../../components/SelectionModal";
import { useFontSize } from "../../context/fontSizeContext";

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const { getFontSizeByKey } = useFontSize();
  const fontSize = (key) => getFontSizeByKey(key);
  const handleTransactionPress = () => {
    router.push("/(tabs)/addTransaction");
  };

  const handleBudgetPress = () => {
    router.push("/(tabs)/addBudget");
  };

  const handleFloatingButtonPress = () => {
    setShowSelectionModal(true);
  };

  return (
    <View style={{ flex: 1 }}>
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
          tabBarLabelStyle: { fontSize: fontSize("sm"), fontWeight: "600" },
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
            name="statistics"
            options={{
            title: "Statistics",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "stats-chart" : "stats-chart-outline"}
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
            href: null, // Hide from tab bar
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
          name="more"
          options={{
            title: "More",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={
                  focused
                    ? "ellipsis-horizontal"
                    : "ellipsis-horizontal-outline"
                }
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="languages"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="currencies"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="themes"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="fontsizes"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="support"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="addBudget"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            href: null,
          }}
        />
      </Tabs>

      <SelectionModal
        visible={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        onSelectTransaction={handleTransactionPress}
        onSelectBudget={handleBudgetPress}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={handleFloatingButtonPress}
        style={{
          position: "absolute",
          bottom: 80 + insets.bottom, // Position above tab bar
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: colors.primary,
          justifyContent: "center",
          alignItems: "center",
          elevation: 4,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 3.84,
        }}
      >
        <Ionicons
          name="add"
          size={32}
          color={colors.surface}
          style={{
            fontWeight: "900",
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default TabsLayout;
