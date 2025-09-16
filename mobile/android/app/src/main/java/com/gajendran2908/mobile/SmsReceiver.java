package com.gajendran2908.mobile;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;
import com.facebook.react.HeadlessJsTaskService;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.Locale;

public class SmsReceiver extends BroadcastReceiver {
  private static final Pattern TRANSACTION_PATTERN = Pattern.compile(
    "(?i)(credited|debited|bank|txn|amount|transaction|spent|purchase|withdrawn|emi|payment|balance(?:\\s+is)?|transfer|upi|neft|imps|rtgs|atm|pos|refund|bill\\s*paid|charge|otp for transaction)",
    Pattern.CASE_INSENSITIVE
  );

  private boolean isLikelyTransaction(String body) {
    if (body == null) return false;
    String trimmed = body.trim();
    if (trimmed.isEmpty()) return false;
    Matcher tx = TRANSACTION_PATTERN.matcher(trimmed);
    return tx.find();
  }
  @Override
  public void onReceive(Context context, Intent intent) {
    if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) {
      Log.d("SmsReceiver", "SMS_RECEIVED broadcast received");
      SmsMessage[] messages = Telephony.Sms.Intents.getMessagesFromIntent(intent);
      if (messages == null || messages.length == 0) {
        Log.w("SmsReceiver", "No messages parsed from intent");
        return;
      }

      StringBuilder fullMessage = new StringBuilder();
      String originatingAddress = null;
      for (SmsMessage sms : messages) {
        if (sms == null) continue;
        if (originatingAddress == null) originatingAddress = sms.getOriginatingAddress();
        CharSequence body = sms.getMessageBody();
        if (body != null) fullMessage.append(body);
      }

      if (fullMessage.length() == 0) return;

      Log.d("SmsReceiver", "From: " + originatingAddress + ", Body: " + fullMessage);

      // Filter: proceed only if SMS looks like a bank/transaction notification
      if (!isLikelyTransaction(fullMessage.toString())) {
        Log.d("SmsReceiver", "SMS ignored (not a transaction-related message)");
        return;
      }

      Intent serviceIntent = new Intent(context, SmsHeadlessService.class);
      serviceIntent.putExtra("from", originatingAddress);
      serviceIntent.putExtra("body", fullMessage.toString());
      try {
        HeadlessJsTaskService.acquireWakeLockNow(context);
        context.startService(serviceIntent);
      } catch (Exception e) {
        Log.e("SmsReceiver", "Failed to start headless service", e);
      }

      // Native fallback notification to ensure user sees something even if JS doesn't run
      try {
        final String channelId = "sms-events";
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
          NotificationChannel channel = new NotificationChannel(
            channelId,
            "SMS Events",
            NotificationManager.IMPORTANCE_HIGH
          );
          NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
          nm.createNotificationChannel(channel);
        }

        // Open lightweight native dialog activity instead of full app
        Intent openIntent = new Intent(context, SmsPromptActivity.class);
        openIntent.putExtra("sms_body", fullMessage.toString());
        openIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pi = PendingIntent.getActivity(
          context,
          1001,
          openIntent,
          PendingIntent.FLAG_UPDATE_CURRENT | (android.os.Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
          .setSmallIcon(context.getResources().getIdentifier("ic_launcher", "mipmap", context.getPackageName()))
          .setContentTitle("Transaction Detected")
          .setContentText("Click to add the new transaction to Expense Meter")
          .setStyle(new NotificationCompat.BigTextStyle().bigText("Click to add the new transaction to Expense Meter"))
          .setPriority(NotificationCompat.PRIORITY_HIGH)
          .setAutoCancel(true)
          .setContentIntent(pi);

        NotificationManagerCompat.from(context).notify(1001, builder.build());
      } catch (Exception e) {
        Log.e("SmsReceiver", "Failed to show native notification", e);
      }
    }
  }
}


