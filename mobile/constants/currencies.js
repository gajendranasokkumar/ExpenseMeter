export const SUPPORTED_CURRENCIES = [
  { code: "INR", label: "Indian Rupee", symbol: "₹" },
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$" },
  { code: "CAD", label: "Canadian Dollar", symbol: "$" },
  { code: "CHF", label: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", label: "Chinese Yuan", symbol: "¥" },
  { code: "HKD", label: "Hong Kong Dollar", symbol: "$" },
  { code: "NZD", label: "New Zealand Dollar", symbol: "$" },
  { code: "SGD", label: "Singapore Dollar", symbol: "$" },
  { code: "BRL", label: "Brazilian Real", symbol: "R$" },
  { code: "MXN", label: "Mexican Peso", symbol: "$" },
  { code: "RUB", label: "Russian Ruble", symbol: "₽" },
  { code: "KRW", label: "South Korean Won", symbol: "₩" },
  { code: "SEK", label: "Swedish Krona", symbol: "kr" },
  { code: "NOK", label: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", label: "Danish Krone", symbol: "kr" },
  { code: "PLN", label: "Polish Złoty", symbol: "zł" },
  { code: "TRY", label: "Turkish Lira", symbol: "₺" },
  { code: "THB", label: "Thai Baht", symbol: "฿" },
  { code: "ZAR", label: "South African Rand", symbol: "R" },
  { code: "AED", label: "UAE Dirham", symbol: "د.إ" },
  { code: "IDR", label: "Indonesian Rupiah", symbol: "Rp" },
  { code: "MYR", label: "Malaysian Ringgit", symbol: "RM" },
  { code: "PHP", label: "Philippine Peso", symbol: "₱" },
];

export const DEFAULT_CURRENCY_CODE = SUPPORTED_CURRENCIES[0].code;

export const findCurrencyByCode = (code) =>
  SUPPORTED_CURRENCIES.find(
    (currency) =>
      currency.code.toLowerCase() === (code ?? "").toLowerCase()
  ) ?? SUPPORTED_CURRENCIES[0];

