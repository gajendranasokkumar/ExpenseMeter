import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  getCurrencyPreferenceSnapshot,
  initCurrencyPreference,
  setCurrencyPreference,
  subscribeToCurrencyPreference,
} from "../utils/currencyPreferenceStore";
import {
  SUPPORTED_CURRENCIES,
  findCurrencyByCode,
} from "../constants/currencies";

const useCurrencyPreference = () => {
  const currencyCode = useSyncExternalStore(
    subscribeToCurrencyPreference,
    getCurrencyPreferenceSnapshot,
    getCurrencyPreferenceSnapshot
  );

  useEffect(() => {
    initCurrencyPreference();
  }, []);

  const selectedCurrency = useMemo(
    () => findCurrencyByCode(currencyCode),
    [currencyCode]
  );

  const setCurrencyCode = useCallback((nextCode) => {
    setCurrencyPreference(nextCode);
  }, []);

  return {
    currencyCode,
    currency: selectedCurrency,
    setCurrencyCode,
    availableCurrencies: SUPPORTED_CURRENCIES,
  };
};

export default useCurrencyPreference;

