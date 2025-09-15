import { AppRegistry, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

// Register Headless JS task for background SMS processing
AppRegistry.registerHeadlessTask('SmsBackgroundTask', () => async (data) => {
  try {
    const body = (data?.body || '').toString();
    if (!body) return;
    const lower = body.toLowerCase();
    const matches = lower.includes('debited') || lower.includes('credited');
    if (!matches) return;

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
      title: 'Transaction SMS',
      message: body,
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



