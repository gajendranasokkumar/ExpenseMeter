package com.gajendran2908.mobile;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.app.Notification;
import android.os.Bundle;
import android.util.Log;
import android.content.Intent;

public class TransactionNotificationListener extends NotificationListenerService {
  @Override
  public void onNotificationPosted(StatusBarNotification sbn) {
    try {
      Notification n = sbn.getNotification();
      if (n == null) return;
      Bundle extras = n.extras;
      if (extras == null) return;
      CharSequence text = extras.getCharSequence(Notification.EXTRA_TEXT);
      CharSequence bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT);
      String body = (bigText != null ? bigText.toString() : (text != null ? text.toString() : ""));
      if (body.isEmpty()) return;

      String lower = body.toLowerCase();
      if (!(lower.contains("debited") || lower.contains("credited"))) return;

      Intent serviceIntent = new Intent(this, SmsHeadlessService.class);
      serviceIntent.putExtra("from", sbn.getPackageName());
      serviceIntent.putExtra("body", body);
      startService(serviceIntent);
    } catch (Exception e) {
      Log.e("TxnNotifListener", "Error parsing notification", e);
    }
  }
}



