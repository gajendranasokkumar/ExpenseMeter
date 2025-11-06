package com.expensemeter.expensemeter

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

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

    @ReactMethod
    fun setAuth(data: ReadableMap, promise: Promise) {
        try {
            val token = if (data.hasKey("token")) data.getString("token") else null
            val userId = if (data.hasKey("userId")) data.getString("userId") else null
            val apiUrl = if (data.hasKey("apiUrl")) data.getString("apiUrl") else null
            TokenStore.token = token
            TokenStore.userId = userId
            TokenStore.apiUrl = apiUrl
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message, e)
        }
    }
}
