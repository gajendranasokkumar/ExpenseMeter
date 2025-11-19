import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEFAULT_CURRENCY_CODE,
  findCurrencyByCode,
} from "../constants/currencies";

const STORAGE_KEY = "preferredCurrencyCode";

let currentCurrencyCode = DEFAULT_CURRENCY_CODE;
let hasLoadedFromStorage = false;
const subscribers = new Set();

const notifySubscribers = () => {
  subscribers.forEach((callback) => {
    try {
      callback();
    } catch (error) {
      console.warn("Currency subscriber error", error);
    }
  });
};

export const subscribeToCurrencyPreference = (callback) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

export const getCurrencyPreferenceSnapshot = () => currentCurrencyCode;

export const initCurrencyPreference = async () => {
  if (hasLoadedFromStorage) {
    return currentCurrencyCode;
  }

  try {
    const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedValue) {
      currentCurrencyCode = findCurrencyByCode(storedValue).code;
    }
  } catch (error) {
    console.warn("Failed to load currency preference", error);
  } finally {
    hasLoadedFromStorage = true;
    notifySubscribers();
  }

  return currentCurrencyCode;
};

export const setCurrencyPreference = async (nextCurrencyCode) => {
  const normalized = findCurrencyByCode(nextCurrencyCode).code;
  if (normalized === currentCurrencyCode) {
    return normalized;
  }

  currentCurrencyCode = normalized;
  notifySubscribers();

  try {
    await AsyncStorage.setItem(STORAGE_KEY, normalized);
  } catch (error) {
    console.warn("Failed to persist currency preference", error);
  }

  return normalized;
};

