import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

// AsyncStorage is React Native's simple, promise-based API for persisting small bits of data on a user's device. Think of it as the mobile-app equivalent of the browser's localStorage, but asynchronous and cross-platform.


const DARK_BLUE_THEME = {
  bg: "#0f172a",
  surface: "#1e293b",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  border: "#334155",
  primary: "#60a5fa",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#bb2124",
  shadow: "#000000",
  expense: "#E74C3C",
  income: "#2ECC71",
  expenseMuted: "#eb6354",
  incomeMuted: "#42c77a",
  orange: "#d48a0d",
  gradients: {
    background: ["#0f172a", "#1e293b"],
    surface: ["#1e293b", "#334155"],
    primary: ["#3b82f6", "#1d4ed8"],
    success: ["#10b981", "#059669"],
    warning: ["#f59e0b", "#d97706"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#374151", "#4b5563"],
    empty: ["#374151", "#4b5563"],
  },
  backgrounds: {
    input: "#1e293b",
    editInput: "#0f172a",
    error: "#fcbdbd",
  },
  statusBarStyle: "light",
  radii: {
    card: 20,
    surface: 20,
    modal: 28,
    input: 16,
    button: 16,
    pill: 12,
    circle: 999,
  },
};

const ORANGE_THEME = {
  bg: "#1a0f0a",
  surface: "#2b1d14",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  border: "#553826",
  primary: "#fb923c",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#bb2124",
  shadow: "#000000",
  expense: "#E74C3C",
  income: "#2ECC71",
  expenseMuted: "#eb6354",
  incomeMuted: "#42c77a",
  orange: "#fb923c",
  gradients: {
    background: ["#1a0f0a", "#2b1d14"],
    surface: ["#2b1d14", "#553826"],
    primary: ["#f97316", "#c2410c"],
    success: ["#10b981", "#059669"],
    warning: ["#f59e0b", "#d97706"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#44362b", "#5c4a3d"],
    empty: ["#44362b", "#5c4a3d"],
  },
  backgrounds: {
    input: "#2b1d14",
    editInput: "#1a0f0a",
    error: "#fcbdbd",
  },
  statusBarStyle: "light",
  radii: {
    card: 20,
    surface: 20,
    modal: 28,
    input: 16,
    button: 16,
    pill: 12,
    circle: 999,
  },
};

const GREEN_THEME = {
  bg: "#0a1a0f",
  surface: "#142b1d",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  border: "#26553a",
  primary: "#4ade80",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#bb2124",
  shadow: "#000000",
  expense: "#E74C3C",
  income: "#2ECC71",
  expenseMuted: "#eb6354",
  incomeMuted: "#42c77a",
  orange: "#d48a0d",
  gradients: {
    background: ["#0a1a0f", "#142b1d"],
    surface: ["#142b1d", "#26553a"],
    primary: ["#22c55e", "#15803d"],
    success: ["#10b981", "#059669"],
    warning: ["#f59e0b", "#d97706"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#2b443a", "#3d5c4a"],
    empty: ["#2b443a", "#3d5c4a"],
  },
  backgrounds: {
    input: "#142b1d",
    editInput: "#0a1a0f",
    error: "#fcbdbd",
  },
  statusBarStyle: "light",
  radii: {
    card: 20,
    surface: 20,
    modal: 28,
    input: 16,
    button: 16,
    pill: 12,
    circle: 999,
  },
};

const PURPLE_THEME = {
  bg: "#170a1a",
  surface: "#271b2e",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  border: "#4a2d55",
  primary: "#c084fc",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#bb2124",
  shadow: "#000000",
  expense: "#E74C3C",
  income: "#2ECC71",
  expenseMuted: "#eb6354",
  incomeMuted: "#42c77a",
  orange: "#d48a0d",
  gradients: {
    background: ["#170a1a", "#271b2e"],
    surface: ["#271b2e", "#4a2d55"],
    primary: ["#a855f7", "#7e22ce"],
    success: ["#10b981", "#059669"],
    warning: ["#f59e0b", "#d97706"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#3d2b44", "#533d5c"],
    empty: ["#3d2b44", "#533d5c"],
  },
  backgrounds: {
    input: "#271b2e",
    editInput: "#170a1a",
    error: "#fcbdbd",
  },
  statusBarStyle: "light",
  radii: {
    card: 20,
    surface: 20,
    modal: 28,
    input: 16,
    button: 16,
    pill: 12,
    circle: 999,
  },
};

const YELLOW_THEME = {
  bg: "#1a170a",
  surface: "#2e271b",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  border: "#55492d",
  primary: "#facc15",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#bb2124",
  shadow: "#000000",
  expense: "#E74C3C",
  income: "#2ECC71",
  expenseMuted: "#eb6354",
  incomeMuted: "#42c77a",
  orange: "#d48a0d",
  gradients: {
    background: ["#1a170a", "#2e271b"],
    surface: ["#2e271b", "#55492d"],
    primary: ["#eab308", "#a16207"],
    success: ["#10b981", "#059669"],
    warning: ["#f59e0b", "#d97706"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#443d2b", "#5c533d"],
    empty: ["#443d2b", "#5c533d"],
  },
  backgrounds: {
    input: "#2e271b",
    editInput: "#1a170a",
    error: "#fcbdbd",
  },
  statusBarStyle: "light",
  radii: {
    card: 20,
    surface: 20,
    modal: 28,
    input: 16,
    button: 16,
    pill: 12,
    circle: 999,
  },
};

const WHITE_THEME = {
  bg: "#fafafa",
  surface: "#f5f5f5",
  text: "#171717",
  textMuted: "#737373",
  border: "#e5e5e5",
  primary: "#525252",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  shadow: "#000000",
  expense: "#E74C3C",
  income: "#2ECC71",
  expenseMuted: "#eb6354",
  incomeMuted: "#42c77a",
  orange: "#f97316",
  gradients: {
    background: ["#fafafa", "#f5f5f5"],
    surface: ["#f5f5f5", "#e5e5e5"],
    primary: ["#737373", "#525252"],
    success: ["#10b981", "#059669"],
    warning: ["#f59e0b", "#d97706"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#e5e5e5", "#d4d4d4"],
    empty: ["#f5f5f5", "#e5e5e5"],
  },
  backgrounds: {
    input: "#f5f5f5",
    editInput: "#fafafa",
    error: "#fee2e2",
  },
  statusBarStyle: "dark",
  radii: {
    card: 20,
    surface: 20,
    modal: 28,
    input: 16,
    button: 16,
    pill: 12,
    circle: 999,
  },
};

const INDIGO_THEME = {
  bg: "#0f0a1a",
  surface: "#1a1429",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  border: "#312d55",
  primary: "#818cf8",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#bb2124",
  shadow: "#000000",
  expense: "#E74C3C",
  income: "#2ECC71",
  expenseMuted: "#eb6354",
  incomeMuted: "#42c77a",
  orange: "#d48a0d",
  gradients: {
    background: ["#0f0a1a", "#1a1429"],
    surface: ["#1a1429", "#312d55"],
    primary: ["#6366f1", "#4338ca"],
    success: ["#10b981", "#059669"],
    warning: ["#f59e0b", "#d97706"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#2b2844", "#3d3a5c"],
    empty: ["#2b2844", "#3d3a5c"],
  },
  backgrounds: {
    input: "#1a1429",
    editInput: "#0f0a1a",
    error: "#fcbdbd",
  },
  statusBarStyle: "light",
  radii: {
    card: 20,
    surface: 20,
    modal: 28,
    input: 16,
    button: 16,
    pill: 12,
    circle: 999,
  },
};

const LIGHT_BLUE_THEME = {
  bg: "#0a1419",
  surface: "#14212b",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  border: "#2d4a5a",
  primary: "#38bdf8",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#bb2124",
  shadow: "#000000",
  expense: "#E74C3C",
  income: "#2ECC71",
  expenseMuted: "#eb6354",
  incomeMuted: "#42c77a",
  orange: "#d48a0d",
  gradients: {
    background: ["#0a1419", "#14212b"],
    surface: ["#14212b", "#2d4a5a"],
    primary: ["#0ea5e9", "#0284c7"],
    success: ["#10b981", "#059669"],
    warning: ["#f59e0b", "#d97706"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#2b3e4a", "#3d525c"],
    empty: ["#2b3e4a", "#3d525c"],
  },
  backgrounds: {
    input: "#14212b",
    editInput: "#0a1419",
    error: "#fcbdbd",
  },
  statusBarStyle: "light",
  radii: {
    card: 20,
    surface: 20,
    modal: 28,
    input: 16,
    button: 16,
    pill: 12,
    circle: 999,
  },
};

// Theme mapping object
export const THEMES = {
  DARK_BLUE: DARK_BLUE_THEME,
  ORANGE: ORANGE_THEME,
  GREEN: GREEN_THEME,
  PURPLE: PURPLE_THEME,
  YELLOW: YELLOW_THEME,
  WHITE: WHITE_THEME,
  INDIGO: INDIGO_THEME,
  LIGHT_BLUE: LIGHT_BLUE_THEME,
};

// Theme display names
export const THEME_NAMES = {
  DARK_BLUE: "Dark Blue",
  ORANGE: "Orange",
  GREEN: "Green",
  PURPLE: "Purple",
  YELLOW: "Yellow",
  WHITE: "White",
  INDIGO: "Indigo",
  LIGHT_BLUE: "Light Blue",
};

const DEFAULT_THEME = "DARK_BLUE";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    // Load the user's theme preference with error handling
    const loadThemePreference = async () => {
      try {
        const value = await AsyncStorage.getItem("selectedTheme");
        if (value !== null) {
          const themeName = value.replace(/"/g, ""); // Remove quotes if present
          if (THEMES[themeName]) {
            setCurrentTheme(themeName);
          } else {
            // If saved theme doesn't exist, use default
            setCurrentTheme(DEFAULT_THEME);
          }
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
        // Fallback to default theme on error
        setCurrentTheme(DEFAULT_THEME);
      }
    };

    loadThemePreference();
  }, []);

  const setTheme = async (themeName) => {
    try {
      if (THEMES[themeName]) {
        setCurrentTheme(themeName);
        await AsyncStorage.setItem("selectedTheme", JSON.stringify(themeName));
      }
    } catch (error) {
      console.error("Error saving theme preference:", error);
      // Revert state on error
      setCurrentTheme(DEFAULT_THEME);
    }
  };

  const colors = THEMES[currentTheme];

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        colors,
        availableThemes: Object.keys(THEMES),
        themeNames: THEME_NAMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export default useTheme;