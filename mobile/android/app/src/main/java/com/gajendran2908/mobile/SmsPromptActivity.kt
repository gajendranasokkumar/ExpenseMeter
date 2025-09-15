package com.gajendran2908.mobile

import android.app.Activity
import android.os.Bundle
import android.view.Gravity
import android.view.WindowManager
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.ImageView
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.util.TypedValue
import android.view.View
import android.widget.Button

class SmsPromptActivity : Activity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Make window behave like a dialog overlay
    window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT)
    window.setBackgroundDrawableResource(android.R.color.transparent)
    window.addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)

    val root = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      // Darker overlay to cover entire screen
      gravity = Gravity.CENTER
      setPadding(dp(24), dp(24), dp(24), dp(24))
      setOnClickListener { finish() }
    }

    val card = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      setPadding(dp(20), dp(20), dp(20), dp(12))
      setBackgroundColor(Color.parseColor("#0f172a"))
      elevation = dp(8).toFloat()
      isClickable = true
    }

    val titleRow = LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER_VERTICAL
    }

    val title = TextView(this).apply {
      text = "Transaction Details"
      setTextColor(Color.parseColor("#F9FAFB")) // near-white
      setTextSize(TypedValue.COMPLEX_UNIT_SP, 18f)
      setPadding(0, 0, dp(8), 0)
      layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
    }

    val close = TextView(this).apply {
      text = "✕"
      setTextColor(Color.parseColor("#D1D5DB"))
      setTextSize(TypedValue.COMPLEX_UNIT_SP, 18f)
      setPadding(dp(8), dp(8), dp(8), dp(8))
      setOnClickListener { finish() }
    }

    titleRow.addView(title)
    titleRow.addView(close)

    val message = intent?.getStringExtra("sms_body") ?: ""

    val body = TextView(this).apply {
      text = message
      setTextColor(Color.parseColor("#E5E7EB"))
      setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
      setPadding(0, dp(12), 0, dp(12))
    }

    val ok = Button(this).apply {
      text = "Close"
      setTextColor(Color.WHITE)
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#2563EB")) // primary blue
        cornerRadius = dp(10).toFloat()
      }
      setPadding(0, dp(12), 0, dp(12))
      setOnClickListener { finish() }
    }

    card.addView(titleRow)
    card.addView(body)
    card.addView(ok)

    root.addView(card, LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT))

    setContentView(root)
  }

  private fun dp(v: Int): Int = (v * resources.displayMetrics.density).toInt()
}


