package com.gajendran2908.mobile;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class SmsHeadlessService extends HeadlessJsTaskService {
  @Override
  protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
    Bundle extras = intent.getExtras();
    if (extras == null) return null;

    String from = extras.getString("from", "");
    String body = extras.getString("body", "");

    WritableMap data = Arguments.createMap();
    data.putString("from", from);
    data.putString("body", body);

    return new HeadlessJsTaskConfig(
      "SmsBackgroundTask",
      data,
      5000,
      true
    );
  }
}



