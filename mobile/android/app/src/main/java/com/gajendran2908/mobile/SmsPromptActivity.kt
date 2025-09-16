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
import android.widget.EditText
import android.widget.Toast
import android.os.AsyncTask
import java.net.HttpURLConnection
import java.net.URL
import org.json.JSONObject
import java.io.BufferedOutputStream
import java.nio.charset.StandardCharsets
import com.gajendran2908.mobile.TokenStore
import android.widget.ProgressBar
import android.view.inputmethod.EditorInfo
import android.text.InputType
import android.text.TextUtils
import android.view.ViewGroup
import android.widget.Spinner
import android.widget.ArrayAdapter
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

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

    // Form fields
    val amountInput = EditText(this).apply {
      hint = "Amount (e.g., 123.45)"
      setTextColor(Color.parseColor("#F9FAFB"))
      setHintTextColor(Color.parseColor("#9CA3AF"))
      inputType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL
      setBackgroundColor(Color.TRANSPARENT)
      setPadding(0, dp(8), 0, dp(8))
    }

    val categoryInput = EditText(this).apply {
      hint = "Category"
      setTextColor(Color.parseColor("#F9FAFB"))
      setHintTextColor(Color.parseColor("#9CA3AF"))
      setBackgroundColor(Color.TRANSPARENT)
      setPadding(0, dp(8), 0, dp(8))
    }

    val bankIdInput = EditText(this).apply {
      hint = "Bank Id"
      setTextColor(Color.parseColor("#F9FAFB"))
      setHintTextColor(Color.parseColor("#9CA3AF"))
      setBackgroundColor(Color.TRANSPARENT)
      setPadding(0, dp(8), 0, dp(8))
    }

    val notesInput = EditText(this).apply {
      hint = "Notes"
      setTextColor(Color.parseColor("#F9FAFB"))
      setHintTextColor(Color.parseColor("#9CA3AF"))
      setBackgroundColor(Color.TRANSPARENT)
      setPadding(0, dp(8), 0, dp(8))
    }

    val submit = Button(this).apply {
      text = "Add"
      setTextColor(Color.WHITE)
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#10B981")) // green
        cornerRadius = dp(10).toFloat()
      }
      setPadding(0, dp(12), 0, dp(12))
    }

    val cancel = Button(this).apply {
      text = "Close"
      setTextColor(Color.WHITE)
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#6B7280")) // gray
        cornerRadius = dp(10).toFloat()
      }
      setPadding(0, dp(12), 0, dp(12))
      setOnClickListener { finish() }
    }

    val progress = ProgressBar(this).apply {
      visibility = View.GONE
    }

    card.addView(titleRow)
    card.addView(body)
    card.addView(labeled("Amount", amountInput))
    card.addView(labeled("Category", categoryInput))
    card.addView(labeled("Bank Id", bankIdInput))
    card.addView(labeled("Notes", notesInput))
    card.addView(progress)
    val buttons = LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
      val lp = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
      addView(cancel, lp)
      addView(View(this@SmsPromptActivity), dp(12), 1)
      addView(submit, lp)
    }
    card.addView(buttons)

    root.addView(card, LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT))

    setContentView(root)

    // Prefill from SMS when possible
    prefillFromSms(message, amountInput, notesInput)

    submit.setOnClickListener {
      submit.isEnabled = false
      progress.visibility = View.VISIBLE
      val amountText = amountInput.text?.toString()?.trim()
      val categoryText = categoryInput.text?.toString()?.trim()
      val bankIdText = bankIdInput.text?.toString()?.trim()
      val notesText = notesInput.text?.toString()?.trim()

      if (amountText.isNullOrEmpty() || categoryText.isNullOrEmpty() || bankIdText.isNullOrEmpty()) {
        Toast.makeText(this, "Please fill amount, category and bank id", Toast.LENGTH_SHORT).show()
        submit.isEnabled = true
        progress.visibility = View.GONE
        return@setOnClickListener
      }

      val userId = TokenStore.userId
      val token = TokenStore.token
      if (userId.isNullOrEmpty() || token.isNullOrEmpty()) {
        Toast.makeText(this, "Not authenticated. Open the app and login.", Toast.LENGTH_LONG).show()
        submit.isEnabled = true
        progress.visibility = View.GONE
        return@setOnClickListener
      }

      sendTransaction(amountText, categoryText, bankIdText, notesText ?: "", userId, token,
        onSuccess = {
          runOnUiThread {
            Toast.makeText(this, "Transaction created", Toast.LENGTH_SHORT).show()
            finish()
          }
        },
        onError = { msg ->
          runOnUiThread {
            Toast.makeText(this, msg ?: "Failed to create transaction", Toast.LENGTH_LONG).show()
            submit.isEnabled = true
            progress.visibility = View.GONE
          }
        }
      )
    }
  }

  private fun dp(v: Int): Int = (v * resources.displayMetrics.density).toInt()

  private fun labeled(label: String, field: View): LinearLayout {
    val container = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      setPadding(0, dp(8), 0, dp(8))
    }
    val tv = TextView(this).apply {
      text = label
      setTextColor(Color.parseColor("#9CA3AF"))
      setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
    }
    val underline = View(this).apply {
      setBackgroundColor(Color.parseColor("#334155"))
      layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(1))
    }
    container.addView(tv)
    container.addView(field)
    container.addView(underline)
    return container
  }

  private fun prefillFromSms(message: String, amountField: EditText, notesField: EditText) {
    try {
      val amtRegex = Regex("(?i)(rs\\.?|inr|₹)\\s*(\\d{1,3}(?:[,\\s]?\\d{2,3})*(?:\\.\\d{1,2})?)")
      val match = amtRegex.find(message)
      if (match != null) {
        val raw = match.groupValues.getOrNull(2)
        if (!raw.isNullOrBlank()) {
          val normalized = raw.replace(",", "").trim()
          amountField.setText(normalized)
        }
      }
      notesField.setText(message.take(200))
    } catch (_: Exception) {}
  }

  private fun sendTransaction(
    amountText: String,
    category: String,
    bankId: String,
    notes: String,
    userId: String,
    token: String,
    onSuccess: () -> Unit,
    onError: (String?) -> Unit
  ) {
    Thread {
      try {
        val url = URL("https://expensemeter-backend.onrender.com/transactions")
        val conn = (url.openConnection() as HttpURLConnection).apply {
          requestMethod = "POST"
          setRequestProperty("Content-Type", "application/json")
          setRequestProperty("Authorization", "Bearer $token")
          doOutput = true
          connectTimeout = 15000
          readTimeout = 15000
        }

        val amountValue = amountText.toDoubleOrNull() ?: throw IllegalArgumentException("Invalid amount")
        val payload = JSONObject().apply {
          put("title", if (notes.isNotBlank()) notes else category)
          put("amount", amountValue)
          put("category", category)
          put("bank", bankId)
          put("date", SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).format(Date()))
          put("user_id", userId)
        }

        val out = BufferedOutputStream(conn.outputStream)
        val bytes = payload.toString().toByteArray(StandardCharsets.UTF_8)
        out.write(bytes)
        out.flush()
        out.close()

        val code = conn.responseCode
        conn.disconnect()
        if (code in 200..299) onSuccess() else onError("HTTP $code")
      } catch (e: Exception) {
        onError(e.message)
      }
    }.start()
  }
}


