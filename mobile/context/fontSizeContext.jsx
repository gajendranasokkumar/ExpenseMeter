import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FontSizeContext = createContext();

const FONT_SIZE_PRESET_STORAGE_KEY = "fontSizePreset";
const DEFAULT_PRESET = "medium"; // Default to medium preset

// Font size presets with scaling factors
const FONT_SIZE_PRESETS = {
  small: {
    name: "Small",
    scale: 0.85, // 85% of original size
  },
  medium: {
    name: "Medium",
    scale: 1.0, // 100% of original size (default)
  },
  large: {
    name: "Large",
    scale: 1.15, // 115% of original size
  },
  extraLarge: {
    name: "Extra Large",
    scale: 1.3, // 130% of original size
  },
};

// Base font sizes used throughout the app (all unique font sizes found)
const BASE_FONT_SIZES = {
  xs: 10,      // Extra small (notificationIconText, some labels)
  xs2: 11,     // Extra small 2 (Preferences)
  sm: 12,      // Small (errorText, detailLabel, notificationItemCreatedAt, infoText)
  sm2: 13,     // Small 2 (sectionTitle, optionDescription, trailingText)
  base: 14,    // Base (subtitle, errorBannerText, inputLabel, buttonText, etc.)
  md: 16,      // Medium (input, buttonText, formTitle, optionTitle, etc.)
  md2: 17,     // Medium 2 (settingText)
  md3: 18,     // Medium 3 (budgetSummaryAmount, profileSectionEmail)
  lg: 20,      // Large (expensesValue, sectionTitle, profileSectionName, etc.)
  lg2: 22,     // Large 2 (app/index.jsx)
  lg3: 24,     // Large 3 (headerTitle, currentMonth, formTitle, etc.)
  xl: 28,      // Extra Large (title, mainBalanceValue, masterTitle)
  xl2: 32,     // Extra Large 2 (auth title)
  xl3: 36,     // Extra Large 3 (responsiveTitle for larger screens)
};

// Helper function to get scaled font size based on preset
const getScaledFontSize = (baseSize, preset) => {
  const scale = FONT_SIZE_PRESETS[preset]?.scale || FONT_SIZE_PRESETS[DEFAULT_PRESET].scale;
  return Math.round(baseSize * scale);
};

export const FontSizeProvider = ({ children }) => {
  const [preset, setPreset] = useState(DEFAULT_PRESET);
  const [isLoading, setIsLoading] = useState(true);

  // Load font size preset from storage on mount
  useEffect(() => {
    const loadFontSizePreset = async () => {
      try {
        const savedPreset = await AsyncStorage.getItem(FONT_SIZE_PRESET_STORAGE_KEY);
        if (savedPreset && FONT_SIZE_PRESETS[savedPreset]) {
          setPreset(savedPreset);
        }
      } catch (error) {
        console.error("Error loading font size preset:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFontSizePreset();
  }, []);

  // Update font size preset and save to storage
  const updatePreset = async (newPreset) => {
    if (!FONT_SIZE_PRESETS[newPreset]) {
      console.error(`Invalid preset: ${newPreset}`);
      return;
    }

    try {
      await AsyncStorage.setItem(FONT_SIZE_PRESET_STORAGE_KEY, newPreset);
      setPreset(newPreset);
    } catch (error) {
      console.error("Error saving font size preset:", error);
    }
  };

  // Get scaled font size for a specific base size
  const getFontSize = (baseSize) => {
    return getScaledFontSize(baseSize, preset);
  };

  // Get all font sizes as an object with keys matching BASE_FONT_SIZES
  const getFontSizes = () => {
    const sizes = {};
    Object.keys(BASE_FONT_SIZES).forEach((key) => {
      sizes[key] = getScaledFontSize(BASE_FONT_SIZES[key], preset);
    });
    return sizes;
  };

  // Get specific font size by key
  const getFontSizeByKey = (key) => {
    const baseSize = BASE_FONT_SIZES[key];
    if (baseSize === undefined) {
      console.warn(`Font size key "${key}" not found. Using base size.`);
      return getScaledFontSize(BASE_FONT_SIZES.base, preset);
    }
    return getScaledFontSize(baseSize, preset);
  };

  const value = {
    // Current preset
    preset,
    isLoading,
    
    // Preset management
    updatePreset,
    presets: FONT_SIZE_PRESETS,
    currentPreset: FONT_SIZE_PRESETS[preset],
    
    // Font size getters
    getFontSize,           // Get scaled size for any base size
    getFontSizes,          // Get all font sizes as object
    getFontSizeByKey,      // Get font size by key (xs, sm, base, md, etc.)
    
    // Base font sizes reference
    baseFontSizes: BASE_FONT_SIZES,
    
    // Convenience methods for common sizes
    xs: getScaledFontSize(BASE_FONT_SIZES.xs, preset),
    xs2: getScaledFontSize(BASE_FONT_SIZES.xs2, preset),
    sm: getScaledFontSize(BASE_FONT_SIZES.sm, preset),
    sm2: getScaledFontSize(BASE_FONT_SIZES.sm2, preset),
    base: getScaledFontSize(BASE_FONT_SIZES.base, preset),
    md: getScaledFontSize(BASE_FONT_SIZES.md, preset),
    md2: getScaledFontSize(BASE_FONT_SIZES.md2, preset),
    md3: getScaledFontSize(BASE_FONT_SIZES.md3, preset),
    lg: getScaledFontSize(BASE_FONT_SIZES.lg, preset),
    lg2: getScaledFontSize(BASE_FONT_SIZES.lg2, preset),
    lg3: getScaledFontSize(BASE_FONT_SIZES.lg3, preset),
    xl: getScaledFontSize(BASE_FONT_SIZES.xl, preset),
    xl2: getScaledFontSize(BASE_FONT_SIZES.xl2, preset),
    xl3: getScaledFontSize(BASE_FONT_SIZES.xl3, preset),
  };

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error("useFontSize must be used within FontSizeProvider");
  }
  return context;
};
