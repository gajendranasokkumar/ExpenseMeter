import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [dest, setDest] = useState(null);

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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Welcome to the app</Text>
      </View>
    );
  }

  if (dest) {
    return <Redirect href={dest} />;
  }

  return null;
};

export default Index;