package com.expensemeter.expensemeter

object TokenStore {
    @Volatile
    var token: String? = null

    @Volatile
    var userId: String? = null

    @Volatile
    var apiUrl: String? = null
}


