import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import TRANSLATIONS from "../constants/translations";

const LANGUAGE_STORAGE_KEY = "selectedLanguage";
const DEFAULT_LANGUAGE = "en";

const SUPPORTED_LANGUAGES = {
  en: { label: "English", locale: "en-US" },
  hi: { label: "Hindi", locale: "hi-IN" },
  es: { label: "Español", locale: "es-ES" },
  fr: { label: "Français", locale: "fr-FR" },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] =
    useState(DEFAULT_LANGUAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(
          LANGUAGE_STORAGE_KEY
        );

        if (storedLanguage && SUPPORTED_LANGUAGES[storedLanguage]) {
          setCurrentLanguage(storedLanguage);
        }
      } catch (error) {
        console.warn("Error loading language preference:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLanguagePreference();
  }, []);

  const setLanguage = async (languageKey) => {
    if (!SUPPORTED_LANGUAGES[languageKey]) {
      return;
    }

    try {
      setCurrentLanguage(languageKey);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageKey);
    } catch (error) {
      console.warn("Error saving language preference:", error);
    }
  };

  const translate = useCallback(
    (key, options = {}) => {
      const { replace = {}, defaultValue } = options;
      const fallbackDictionary = TRANSLATIONS[DEFAULT_LANGUAGE] ?? {};
      const dictionary =
        TRANSLATIONS[currentLanguage] ?? fallbackDictionary;

      const resolveKey = (dict, lookupKey) => {
        if (!dict) {
          return undefined;
        }

        if (Object.prototype.hasOwnProperty.call(dict, lookupKey)) {
          return dict[lookupKey];
        }

        return lookupKey
          .split(".")
          .reduce(
            (acc, part) =>
              acc && typeof acc === "object"
                ? acc[part]
                : undefined,
            dict
          );
      };

      let phrase =
        resolveKey(dictionary, key) ??
        resolveKey(fallbackDictionary, key) ??
        defaultValue ??
        key;

      if (replace) {
        Object.entries(replace).forEach(([token, value]) => {
          phrase = phrase.replace(
            new RegExp(`{${token}}`, "g"),
            String(value)
          );
        });
      }

      return phrase;
    },
    [currentLanguage]
  );

  const value = useMemo(
    () => ({
      currentLanguage,
      setLanguage,
      availableLanguages: Object.keys(SUPPORTED_LANGUAGES),
      languageMeta: SUPPORTED_LANGUAGES,
      loading,
      t: translate,
    }),
    [currentLanguage, loading, translate]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};

export default useLanguage;

