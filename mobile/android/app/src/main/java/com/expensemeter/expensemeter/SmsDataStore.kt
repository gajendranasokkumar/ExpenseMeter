package com.expensemeter.expensemeter

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
