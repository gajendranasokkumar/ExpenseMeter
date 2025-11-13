import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { View, PermissionsAndroid, Platform } from "react-native";
import { ThemeProvider } from "../hooks/useTheme";
import { LanguageProvider } from "../hooks/useLanguage";
import useTheme from "../hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../components/SafeScreen";
import { UserProvider } from "../context/userContext";
import { TransactionsProvider } from "../context/transactionsContext";
import PushNotification from "react-native-push-notification";
// SMS modal is handled via the /sms route, not here

const RootLayout = () => {
  return (
    <UserProvider>
      <LanguageProvider>
        <ThemeProvider>
          <TransactionsProvider>
            <SafeScreen>
              <Layout />
            </SafeScreen>
          </TransactionsProvider>
        </ThemeProvider>
      </LanguageProvider>
    </UserProvider>
  );
};

const Layout = () => {
  const { colors } = useTheme();
  useEffect(() => {
    const ensureSmsPermissions = async () => {
      if (Platform.OS === "android") {
        try {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
            PermissionsAndroid.PERMISSIONS.READ_SMS,
          ]);
          if (Platform.Version >= 33 && PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
          }
        } catch (e) {}
      }
    };
    ensureSmsPermissions();


    PushNotification.createChannel(
      {
        channelId: "sms-events",
        channelName: "SMS Events",
        channelDescription: "Notifications for incoming SMS with transactions",
        importance: 4,
        vibrate: true,
      },
      () => {}
    );

    PushNotification.configure({
      onNotification: function (notification) {
        // Avoid opening modal here; deep link route will handle UI.
        try {
          console.log('[PushNotification] onNotification payload:', notification);
        } catch (_) {}
        notification?.finish && notification.finish();
      },
      popInitialNotification: true,
      requestPermissions: false,
    });

    // No explicit popInitialNotification; deep links handled by router (/sms)

    // Cleanup function
    return () => {};
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={colors.statusBarStyle} />
      <Slot />
    </View>
  );
};

export default RootLayout;
