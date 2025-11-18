import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  cancelPersistentNotification,
  showPersistentNotification,
} from "../utils/persistentNotification";

const NotificationPreferencesContext = createContext(undefined);

const STORAGE_KEY = "@expense_meter:persistent_notification_enabled";

export const NotificationPreferencesProvider = ({ children }) => {
  const [persistentNotificationEnabled, setPersistentNotificationEnabledState] =
    useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isUpdatingPersistentNotification, setIsUpdating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedValue !== null) {
          setPersistentNotificationEnabledState(
            storedValue === "true" || storedValue === "1"
          );
        }
      } catch (error) {
        console.log("Failed to load notification preference", error);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const applyPersistentNotification = useCallback(async (isEnabled) => {
    try {
      if (isEnabled) {
        await showPersistentNotification();
      } else {
        await cancelPersistentNotification();
      }
    } catch (error) {
      console.log("Failed to update persistent notification", error);
    }
  }, []);

  const setPersistentNotificationEnabled = useCallback(
    async (nextValue) => {
      setIsUpdating(true);
      try {
        setPersistentNotificationEnabledState(nextValue);
        await AsyncStorage.setItem(STORAGE_KEY, nextValue ? "1" : "0");
        await applyPersistentNotification(nextValue);
      } finally {
        setIsUpdating(false);
      }
    },
    [applyPersistentNotification]
  );

  useEffect(() => {
    if (hydrated && persistentNotificationEnabled) {
      applyPersistentNotification(true);
    }
  }, [hydrated, persistentNotificationEnabled, applyPersistentNotification]);

  const value = useMemo(
    () => ({
      persistentNotificationEnabled,
      isNotificationPreferenceLoading: !hydrated,
      isUpdatingPersistentNotification,
      setPersistentNotificationEnabled,
    }),
    [
      hydrated,
      isUpdatingPersistentNotification,
      persistentNotificationEnabled,
      setPersistentNotificationEnabled,
    ]
  );

  return (
    <NotificationPreferencesContext.Provider value={value}>
      {children}
    </NotificationPreferencesContext.Provider>
  );
};

export const useNotificationPreferences = () => {
  const context = useContext(NotificationPreferencesContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationPreferences must be used within NotificationPreferencesProvider"
    );
  }
  return context;
};

