import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import SMSModal from "../components/SMSModal";
import { View } from "react-native";

const SmsRoute = () => {
  const router = useRouter();
  const { body } = useLocalSearchParams();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // If no body provided, return to home to avoid empty screen
    if (!body) {
      router.replace("/");
    }
  }, [body]);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ presentation: 'transparentModal', headerShown: false }} />
      <SMSModal
        visible={!!body && visible}
        smsData={typeof body === "string" ? decodeURIComponent(body) : ""}
        onClose={() => {
          setVisible(false);
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/");
          }
        }}
      />
    </View>
  );
};

export default SmsRoute;


