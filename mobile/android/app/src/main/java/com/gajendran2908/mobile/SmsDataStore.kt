package com.gajendran2908.mobile

object SmsDataStore {
    private var smsData: String? = null

    fun setSmsData(data: String) {
        smsData = data
    }

    fun getSmsData(): String? {
        val data = smsData
        smsData = null // Clear after reading
        return data
    }

    fun hasSmsData(): Boolean {
        return smsData != null
    }
}
