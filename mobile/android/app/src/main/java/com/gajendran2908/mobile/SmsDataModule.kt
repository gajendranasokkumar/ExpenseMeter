package com.gajendran2908.mobile

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class SmsDataModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SmsDataModule"
    }

    @ReactMethod
    fun getSmsData(promise: Promise) {
        try {
            val smsData = SmsDataStore.getSmsData()
            promise.resolve(smsData)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun hasSmsData(promise: Promise) {
        try {
            val hasData = SmsDataStore.hasSmsData()
            promise.resolve(hasData)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message, e)
        }
    }
}
