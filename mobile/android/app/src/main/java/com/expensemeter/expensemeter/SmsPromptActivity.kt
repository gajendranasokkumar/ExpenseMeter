package com.expensemeter.expensemeter

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
import com.expensemeter.expensemeter.TokenStore
import android.widget.ProgressBar
import android.view.inputmethod.EditorInfo
import android.text.InputType
import android.text.TextUtils
import android.view.ViewGroup
import android.widget.Spinner
import android.widget.ArrayAdapter
import android.widget.ScrollView
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import android.widget.GridLayout
import android.widget.HorizontalScrollView

class SmsPromptActivity : Activity() {
  private var bankSpinnerRef: Spinner? = null
  private var bankAdapterRef: ArrayAdapter<String>? = null
  private var bankIdsRef: List<String> = emptyList()
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Make window behave like a dialog overlay
    window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT)
    window.setBackgroundDrawableResource(android.R.color.transparent)
    // Avoid layout flags that conflict with SOFT_INPUT_ADJUST_RESIZE
    window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE)

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

    // Income / Expense toggle
    var selectedType: String? = null // "income" | "expense"
    val toggleRow = LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
    }
    fun makeToggleButton(label: String, activeColor: String): LinearLayout {
      return LinearLayout(this).apply {
        orientation = LinearLayout.HORIZONTAL
        val bg = GradientDrawable().apply {
          setColor(Color.parseColor("#111827"))
          cornerRadius = dp(10).toFloat()
          setStroke(dp(1), Color.parseColor("#334155"))
        }
        background = bg
        setPadding(dp(12), dp(10), dp(12), dp(10))
        val tv = TextView(this@SmsPromptActivity).apply {
          text = label
          setTextColor(Color.parseColor("#9CA3AF"))
          setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
        }
        addView(tv)
      }
    }
    val incomeBtn = makeToggleButton("Income", "#86EFAC")
    val expenseBtn = makeToggleButton("Expense", "#FCA5A5")
    fun styleToggle(btn: LinearLayout, isActive: Boolean, activeColorHex: String) {
      val g = (btn.background as GradientDrawable)
      g.setStroke(dp(1), Color.parseColor(if (isActive) activeColorHex else "#334155"))
      (btn.getChildAt(0) as? TextView)?.setTextColor(Color.parseColor(if (isActive) activeColorHex else "#9CA3AF"))
    }
    fun updateToggleStyles() {
      styleToggle(incomeBtn, selectedType == "income", "#86EFAC")
      styleToggle(expenseBtn, selectedType == "expense", "#FCA5A5")
    }
    incomeBtn.setOnClickListener {
      selectedType = "income"
      updateToggleStyles()
    }
    expenseBtn.setOnClickListener {
      selectedType = "expense"
      updateToggleStyles()
    }
    val lpToggle = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f).apply {
      setMargins(0, 0, dp(8), 0)
    }
    toggleRow.addView(incomeBtn, lpToggle)
    toggleRow.addView(expenseBtn, LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))

    // Form fields
    val amountInput = EditText(this).apply {
      hint = "Amount (e.g., 123.45)"
      setTextColor(Color.parseColor("#F9FAFB"))
      setHintTextColor(Color.parseColor("#9CA3AF"))
      inputType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL
      setBackgroundColor(Color.TRANSPARENT)
      setPadding(0, dp(8), 0, dp(8))
    }

    // Category horizontal chips
    val categoryScroll = HorizontalScrollView(this).apply {
      isHorizontalScrollBarEnabled = false
    }
    val categoryRow = LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
    }
    categoryScroll.addView(categoryRow, LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT))
    val categories = listOf(
      Pair("Food", "#F5DEB3"),
      Pair("Transport", "#FFFF00"),
      Pair("Entertainment", "#F08080"),
      Pair("Shopping", "#00FFFF"),
      Pair("Salary", "#90EE90"),
      Pair("Investment", "#FFA500"),
      Pair("Petrol / Gas", "#DEB887"),
      Pair("Medical", "#FFDAB9"),
      Pair("Clothes", "#F08080"),
      Pair("Rent", "#FFC0CB"),
      Pair("Other Bills", "#D3D3D3"),
      Pair("Education", "#90EE90"),
      Pair("Travel", "#FFA500"),
      Pair("Other", "#DDA0DD")
    )
    var selectedCategoryName: String? = null
    fun rebuildCategoryRow() {
      categoryRow.removeAllViews()
      for ((name, colorHex) in categories) {
        val item = LinearLayout(this).apply {
          orientation = LinearLayout.VERTICAL
          val bg = GradientDrawable().apply {
            setColor(Color.parseColor("#111827"))
            cornerRadius = dp(10).toFloat()
            setStroke(dp(1), if (selectedCategoryName == name) Color.parseColor(colorHex) else Color.parseColor("#334155"))
          }
          background = bg
          setPadding(dp(12), dp(10), dp(12), dp(10))
        }
        val tv = TextView(this).apply {
          text = name
          setTextColor(if (selectedCategoryName == name) Color.parseColor(colorHex) else Color.parseColor("#9CA3AF"))
          setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
        }
        item.addView(tv)
        val lp = LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
          setMargins(dp(6), dp(6), dp(6), dp(6))
        }
        item.setOnClickListener {
          selectedCategoryName = name
          rebuildCategoryRow()
        }
        categoryRow.addView(item, lp)
      }
    }
    rebuildCategoryRow()

    // Bank dropdown (populated from backend)
    val bankSpinner = Spinner(this)
    this.bankSpinnerRef = bankSpinner
    val bankAdapter = object : ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item, mutableListOf("Loading...")) {
      override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val v = super.getView(position, convertView, parent)
        (v as? TextView)?.setTextColor(Color.parseColor("#F9FAFB"))
        return v
      }
      override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup): View {
        val v = super.getDropDownView(position, convertView, parent)
        (v as? TextView)?.setTextColor(Color.parseColor("#000000"))
        return v
      }
    }
    bankSpinner.adapter = bankAdapter
    this.bankAdapterRef = bankAdapter

    val notesInput = EditText(this).apply {
      hint = "Notes"
      setTextColor(Color.parseColor("#F9FAFB"))
      setHintTextColor(Color.parseColor("#9CA3AF"))
      setBackgroundColor(Color.TRANSPARENT)
      setPadding(0, dp(8), 0, dp(8))
      inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_MULTI_LINE
      isSingleLine = false
      minLines = 2
      maxLines = 5
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
    card.addView(labeled("Type", toggleRow, false))
    card.addView(labeled("Amount", amountInput))
    card.addView(labeled("Category", categoryScroll, false))
    card.addView(labeled("Bank", bankSpinner))
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

    val scroll = ScrollView(this).apply {
      isFillViewport = true
      addView(card, LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT))
    }
    root.addView(scroll, LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT))

    setContentView(root)

    // Prefill only amount from SMS; keep notes empty
    prefillAmountFromSms(message, amountInput)

    submit.setOnClickListener {
      submit.isEnabled = false
      progress.visibility = View.VISIBLE
      val amountText = amountInput.text?.toString()?.trim()
      val categoryText = selectedCategoryName?.trim()
      val selectedPos = bankSpinner.selectedItemPosition
      val bankIdText = if (selectedPos >= 0 && selectedPos < bankIdsRef.size) bankIdsRef[selectedPos] else ""
      val notesText = ""

      if (selectedType == null || amountText.isNullOrEmpty() || categoryText.isNullOrEmpty() || bankIdText.isNullOrEmpty()) {
        Toast.makeText(this, "Select type and fill amount, category and bank", Toast.LENGTH_SHORT).show()
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

      sendTransaction(amountText, selectedType!!, categoryText, bankIdText, notesText, userId, token,
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

    // Fetch banks for user
    fetchBanksForUser()
  }

  private fun dp(v: Int): Int = (v * resources.displayMetrics.density).toInt()

  private fun labeled(label: String, field: View, showUnderline: Boolean = true): LinearLayout {
    val container = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      setPadding(0, dp(8), 0, dp(8))
    }
    val tv = TextView(this).apply {
      text = label
      setTextColor(Color.parseColor("#9CA3AF"))
      setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
    }
    container.addView(tv)
    container.addView(field)
    if (showUnderline) {
      val underline = View(this).apply {
        setBackgroundColor(Color.parseColor("#334155"))
        layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(1))
      }
      container.addView(underline)
    }
    return container
  }

  private fun prefillAmountFromSms(message: String, amountField: EditText) {
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
    } catch (_: Exception) {}
  }

  private fun fetchBanksForUser() {
    val userId = TokenStore.userId
    val token = TokenStore.token
    val apiUrl = TokenStore.apiUrl ?: "https://expensemeter-backend.onrender.com"
    if (userId.isNullOrEmpty() || token.isNullOrEmpty() || apiUrl.isNullOrEmpty()) return
    Thread {
      try {
        val url = URL("$apiUrl/banks/all")
        val conn = (url.openConnection() as HttpURLConnection).apply {
          requestMethod = "POST"
          setRequestProperty("Content-Type", "application/json")
          setRequestProperty("Authorization", "Bearer $token")
          doOutput = true
          connectTimeout = 15000
          readTimeout = 15000
        }
        val payload = JSONObject().apply { put("userId", userId) }
        conn.outputStream.use { it.write(payload.toString().toByteArray(StandardCharsets.UTF_8)) }
        val code = conn.responseCode
        if (code in 200..299) {
          val text = conn.inputStream.bufferedReader().readText()
          val json = JSONObject(text)
          val data = json.optJSONArray("data")
          val names = mutableListOf<String>()
          val ids = mutableListOf<String>()
          if (data != null) {
            for (i in 0 until data.length()) {
              val item = data.optJSONObject(i)
              val id = item?.optString("_id") ?: continue
              val name = item.optString("name", id)
              names.add(name)
              ids.add(id)
            }
          }
          runOnUiThread {
            val adapter = bankAdapterRef
            if (adapter != null) {
              adapter.clear()
              if (names.isNotEmpty()) {
                adapter.addAll(names)
                bankIdsRef = ids
              } else {
                adapter.add("No banks")
                bankIdsRef = emptyList()
              }
              adapter.notifyDataSetChanged()
              bankSpinnerRef?.setSelection(0)
            }
          }
        }
        conn.disconnect()
      } catch (_: Exception) {}
    }.start()
  }

  private fun findBankSpinner(): Spinner? {
    // Since we built the view in-code, traverse to find the first Spinner under the root
    val root = window?.decorView?.findViewById<View>(android.R.id.content) as? ViewGroup ?: return null
    return findSpinnerRecursive(root)
  }

  private fun findSpinnerRecursive(group: ViewGroup): Spinner? {
    for (i in 0 until group.childCount) {
      val child = group.getChildAt(i)
      if (child is Spinner) return child
      if (child is ViewGroup) {
        val found = findSpinnerRecursive(child)
        if (found != null) return found
      }
    }
    return null
  }

  private fun sendTransaction(
    amountText: String,
    type: String,
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
        val base = TokenStore.apiUrl ?: "https://expensemeter-backend.onrender.com"
        val url = URL("$base/transactions")
        val conn = (url.openConnection() as HttpURLConnection).apply {
          requestMethod = "POST"
          setRequestProperty("Content-Type", "application/json")
          setRequestProperty("Authorization", "Bearer $token")
          doOutput = true
          connectTimeout = 15000
          readTimeout = 15000
        }

        val baseAmount = amountText.toDoubleOrNull() ?: throw IllegalArgumentException("Invalid amount")
        val amountValue = if (type == "income") kotlin.math.abs(baseAmount) else -kotlin.math.abs(baseAmount)
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


