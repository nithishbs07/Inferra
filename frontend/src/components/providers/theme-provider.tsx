/**
 * Inferra — Theme Provider
 *
 * Provides theme context to the application. Currently dark-mode only,
 * with architecture prepared for future light mode support.
 *
 * Props:
 * - `defaultTheme` — Initial theme ("dark" | "light" | "system"). Default: "dark"
 * - `storageKey` — localStorage key for persistence. Default: "openhands-theme"
 * - `children` — React children
 *
 * Usage:
 * ```tsx
 * // In root layout:
 * <ThemeProvider defaultTheme="dark">
 *   <App />
 * </ThemeProvider>
 *
 * // In any component:
 * const { theme, setTheme } = useTheme();
 * ```
 *
 * Accessibility:
 * - Respects `prefers-color-scheme` when theme is "system"
 * - Applies `data-theme` attribute to document root for CSS token switching
 */

import React from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeContextValue {
  /** Current resolved theme ("dark" | "light") */
  theme: "dark" | "light";
  /** Raw theme setting including "system" */
  themeSetting: Theme;
  /** Update the theme */
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: Theme): "dark" | "light" {
  if (theme === "system") return getSystemTheme();
  return theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "openhands-theme",
}: ThemeProviderProps) {
  const [themeSetting, setThemeSetting] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    const stored = localStorage.getItem(storageKey) as Theme | null;
    return stored || defaultTheme;
  });

  const resolvedTheme = resolveTheme(themeSetting);

  // Apply theme to document
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", resolvedTheme);
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // Listen for system theme changes when set to "system"
  React.useEffect(() => {
    if (themeSetting !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const root = document.documentElement;
      const newTheme = getSystemTheme();
      root.setAttribute("data-theme", newTheme);
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [themeSetting]);

  const setTheme = React.useCallback(
    (theme: Theme) => {
      setThemeSetting(theme);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, theme);
      }
    },
    [storageKey],
  );

  const value = React.useMemo(
    () => ({
      theme: resolvedTheme,
      themeSetting,
      setTheme,
    }),
    [resolvedTheme, themeSetting, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Hook to access the current theme and theme setter.
 *
 * @returns `{ theme, themeSetting, setTheme }`
 * - `theme` — Resolved theme ("dark" | "light")
 * - `themeSetting` — Raw setting ("dark" | "light" | "system")
 * - `setTheme` — Function to update theme
 *
 * @throws Error if used outside ThemeProvider
 *
 * @example
 * ```tsx
 * const { theme, setTheme } = useTheme();
 * // theme === "dark"
 * // setTheme("light") — for future use
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
