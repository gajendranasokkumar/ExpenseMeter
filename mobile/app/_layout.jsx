import React, { useEffect } from "react";
import { Slot, router } from "expo-router";
import { View, PermissionsAndroid, Platform } from "react-native";
import useTheme, { ThemeProvider } from "../hooks/useTheme";
import { LanguageProvider } from "../hooks/useLanguage";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../components/SafeScreen";
import { UserProvider } from "../context/userContext";
import { TransactionsProvider } from "../context/transactionsContext";
import { FontSizeProvider } from "../context/fontSizeContext";
import PushNotification from "react-native-push-notification";
import { NotificationPreferencesProvider } from "../context/notificationPreferencesContext";
import { PERSISTENT_NOTIFICATION_CHANNEL_ID } from "../utils/persistentNotification";
// SMS modal is handled via the /sms route, not here

const RootLayout = () => {
  return (
    <UserProvider>
      <LanguageProvider>
        <ThemeProvider>
          <FontSizeProvider>
            <NotificationPreferencesProvider>
              <TransactionsProvider>
                <SafeScreen>
                  <Layout />
                </SafeScreen>
              </TransactionsProvider>
            </NotificationPreferencesProvider>
          </FontSizeProvider>
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
        } catch (_error) {}
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

    PushNotification.createChannel(
      {
        channelId: PERSISTENT_NOTIFICATION_CHANNEL_ID,
        channelName: "Expense Meter reminder",
        channelDescription:
          "Keeps a pinned notification for quick access to Expense Meter.",
        importance: 4,
        vibrate: false,
        playSound: false,
      },
      () => {}
    );

    PushNotification.configure({
      onNotification: function (notification) {
        try {
          if (notification?.userInteraction) {
            const targetTab =
              notification?.data?.targetTab ||
              notification?.userInfo?.targetTab ||
              "/(tabs)";
            if (targetTab) {
              router.push(targetTab);
            }
          }
          console.log(
            "[PushNotification] onNotification payload:",
            notification
          );
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
