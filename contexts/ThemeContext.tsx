import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Appearance, ColorSchemeName, useColorScheme } from "react-native";
import { getItem, setItem } from "@/utils/asyncStorage";
import { StatusBar } from "expo-status-bar";
import { animateThemeTransition, debounce } from "@/utils/themeUtils";

type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colorScheme: "light" | "dark";
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Ensure systemColorScheme is never undefined
  const deviceColorScheme = useColorScheme();
  const systemColorScheme = (
    typeof deviceColorScheme === "string" ? deviceColorScheme : "light"
  ) as "light" | "dark";

  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    systemColorScheme
  );

  // Prevent excessive theme updates with a ref
  const isUpdatingRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);

  // Computed property to easily check if we're in dark mode
  const isDarkMode = colorScheme === "dark";

  // Load saved theme on initial mount only
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getItem("@theme");
        // Validate that savedTheme is a valid ThemeMode value
        if (
          savedTheme &&
          (savedTheme === "light" ||
            savedTheme === "dark" ||
            savedTheme === "system")
        ) {
          setThemeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      }
    };

    loadTheme();
  }, []);

  // Set up appearance change listener
  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme: newColorScheme }) => {
        if (theme === "system" && typeof newColorScheme === "string") {
          // Prevent animation if we're already updating
          if (!isUpdatingRef.current) {
            // Animate the transition when system theme changes
            animateThemeTransition();
            setColorScheme(newColorScheme as "light" | "dark");
          }
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [theme]);

  // Update color scheme immediately when theme changes
  useEffect(() => {
    if (theme === "system") {
      setColorScheme(systemColorScheme);
    } else {
      setColorScheme(theme);
    }
  }, [theme, systemColorScheme]);

  // Debounced save function to prevent excessive writes
  const saveThemePreference = useCallback(
    debounce(async (newTheme: ThemeMode) => {
      try {
        await setItem("@theme", newTheme);
        // Reset update lock after save is complete
        isUpdatingRef.current = false;
      } catch (error) {
        console.error("Failed to save theme preference:", error);
        isUpdatingRef.current = false;
      }
    }, 500),
    []
  );

  // Optimized setTheme function with animation
  const setTheme = useCallback(
    (newTheme: ThemeMode) => {
      // Validate the newTheme value
      if (
        typeof newTheme !== "string" ||
        !["light", "dark", "system"].includes(newTheme)
      ) {
        console.error("Invalid theme value:", newTheme);
        return;
      }

      const now = Date.now();
      // Prevent rapid theme changes - only allow if more than 700ms since last change
      if (isUpdatingRef.current && now - lastUpdateTimeRef.current < 700) {
        console.log("Throttling theme change - too soon");
        return;
      }

      // Only change if theme is actually different
      if (newTheme !== theme) {
        // Mark as updating
        isUpdatingRef.current = true;
        lastUpdateTimeRef.current = now;

        // Animate the transition
        animateThemeTransition();

        // Update state immediately for responsive UI
        setThemeState(newTheme);

        // Save preference in the background with debounce
        saveThemePreference(newTheme);
      }
    },
    [theme, saveThemePreference]
  );

  // Optimized toggle function
  const toggleTheme = useCallback(() => {
    // Don't allow toggle if we're already updating
    if (isUpdatingRef.current) {
      return;
    }

    const newTheme =
      theme === "system"
        ? colorScheme === "dark"
          ? "light"
          : "dark"
        : theme === "dark"
        ? "light"
        : "dark";

    setTheme(newTheme);
  }, [theme, colorScheme, setTheme]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clean up any pending debounced operations
      if (typeof (saveThemePreference as any).cancel === "function") {
        (saveThemePreference as any).cancel();
      }
    };
  }, [saveThemePreference]);

  const contextValue = {
    theme,
    setTheme,
    colorScheme,
    toggleTheme,
    isDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
