import { getCurrencyPreferenceSnapshot } from "./currencyPreferenceStore";

export const formatAmountDisplay = (amount, overrideCurrencyCode) => {
  const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  const currencyCode = overrideCurrencyCode ?? getCurrencyPreferenceSnapshot();

  try {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: "currency",
      currency: currencyCode,
    }).format(safeAmount);
  } catch (error) {
    console.warn("Failed to format currency", error);
    return safeAmount.toFixed(2);
  }
};
