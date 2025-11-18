import { Platform } from "react-native";
import PushNotification from "react-native-push-notification";

export const PERSISTENT_NOTIFICATION_CHANNEL_ID =
  "expense-meter-persistent";
export const PERSISTENT_NOTIFICATION_ID = 48001;
export const DEFAULT_NOTIFICATION_TARGET = "/(tabs)/addTransaction";

const ensureChannel = () => {
  if (Platform.OS !== "android") return;
  PushNotification.createChannel(
    {
      channelId: PERSISTENT_NOTIFICATION_CHANNEL_ID,
      channelName: "Expense Meter reminder",
      channelDescription:
        "Keeps a quick shortcut to jump back into Expense Meter.",
      importance: 4,
      vibrate: true,
      playSound: true,
    },
    () => {}
  );
};

export const showPersistentNotification = async ({
  title = "Expense Meter is ready",
  message = "Tap to jump back to your finances.",
  targetTab = DEFAULT_NOTIFICATION_TARGET,
} = {}) => {
  ensureChannel();
  PushNotification.localNotification({
    id: `${PERSISTENT_NOTIFICATION_ID}`,
    channelId: PERSISTENT_NOTIFICATION_CHANNEL_ID,
    title,
    message,
    autoCancel: false,
    ongoing: true,
    onlyAlertOnce: true,
    allowWhileIdle: true,
    invokeApp: true,
    importance: "high",
    priority: "high",
    userInfo: { targetTab },
    data: { targetTab },
  });
};

export const cancelPersistentNotification = async () => {
  PushNotification.cancelLocalNotification(`${PERSISTENT_NOTIFICATION_ID}`);
  PushNotification.cancelLocalNotifications?.({
    id: `${PERSISTENT_NOTIFICATION_ID}`,
  });
};

