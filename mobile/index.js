import { AppRegistry, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

// Register Headless JS task for background SMS processing
AppRegistry.registerHeadlessTask('SmsBackgroundTask', () => async (data) => {
  try {
    const body = (data?.body || '').toString();
    if (!body) return;
    // Use same keyword filter as native SmsReceiver
    const TRANSACTION_REGEX = /(credited|debited|bank|txn|amount|transaction|spent|purchase|withdrawn|emi|payment|balance(?:\s+is)?|transfer|upi|neft|imps|rtgs|atm|pos|refund|bill\s*paid|charge|otp for transaction)/i;
    if (!TRANSACTION_REGEX.test(body)) return;

    // Ensure channel exists on Android before sending notification
    if (Platform.OS === 'android') {
      PushNotification.createChannel({
        channelId: 'sms-events',
        channelName: 'SMS Events',
        channelDescription: 'Notifications for incoming SMS with transactions',
        importance: 4,
        vibrate: true,
      }, () => {});
    }

    PushNotification.localNotification({
      channelId: 'sms-events',
      title: 'Transaction Detected',
      message: "Open Expense Meter now",
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      // pass along data for when the user taps the notification
      userInfo: { body },
    });
  } catch (_) {}
});

// Continue with Expo Router entry
import 'expo-router/entry';



