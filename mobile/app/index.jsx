import { Redirect } from "expo-router";
import { Text, View, Image, ActivityIndicator, StatusBar } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useTheme from "../hooks/useTheme";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [dest, setDest] = useState(null);
  const { colors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      (async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          console.log(token);
          setDest(token ? "/(tabs)" : "/(auth)/login");
        } finally {
          setShowSplash(false);
        }
      })();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          backgroundColor: colors.bg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/images/manwithlaptop.png")}
          style={{ width: 240, height: 240, marginBottom: 16 }}
          resizeMode="contain"
        />
        <View
          style={{
            width: "100%",
            backgroundColor: colors.surface,
            borderRadius: 16,
            paddingVertical: 20,
            paddingHorizontal: 16,
            shadowColor: colors.shadow,
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 4,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 22,
              fontWeight: "700",
              textAlign: "center",
              marginBottom: 6,
            }}
          >
            Welcome to Expense Meter
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: 14,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Track spending, plan budgets, and reach your goals confidently.
          </Text>

          <View style={{ alignItems: "center" }}>
            <ActivityIndicator size="small" color={colors.primary} />
            {/* <View
              style={{
                width: "100%",
                height: 6,
                backgroundColor: colors.border,
                borderRadius: 999,
                marginTop: 12,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: "40%",
                  height: "100%",
                  backgroundColor: colors.primary,
                  borderRadius: 999,
                }}
              />
            </View> */}
          </View>
        </View>
      </View>
    );
  }

  if (dest) {
    return <Redirect href={dest} />;
  }

  return null;
};

export default Index;