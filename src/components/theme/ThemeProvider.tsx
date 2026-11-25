"use client";

import { App as AntdApp, ConfigProvider, theme as antdTheme } from "antd";
import React, {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "luakhoe-theme";
const THEME_EVENT = "luakhoe-theme-change";

interface ThemeContextValue {
  theme: ThemeMode;
  mounted: boolean;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  mounted: false,
  setTheme: () => undefined,
  toggleTheme: () => undefined,
});

const emptySubscribe = () => () => {};

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) {
      if (e.newValue === "dark" || e.newValue === "light") {
        applyThemeToDom(e.newValue);
      }
      callback();
    }
  };
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getThemeSnapshot(): ThemeMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerThemeSnapshot(): ThemeMode {
  return "light";
}

function applyThemeToDom(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const setTheme = useCallback((mode: ThemeMode) => {
    applyThemeToDom(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Ignore storage quota / privacy mode errors
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const isDark = mounted && theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, mounted, setTheme, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: isDark
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: isDark ? "#34b352" : "#1f7a3e",
            colorBgContainer: isDark ? "#16201a" : "#ffffff",
            colorBgElevated: isDark ? "#1d2a22" : "#ffffff",
            colorBgLayout: isDark ? "#0e1511" : "#f6f8f5",
            colorBorder: isDark ? "#283a2f" : "#dce4dc",
            colorText: isDark ? "#ecf3ee" : "#142118",
            colorTextSecondary: isDark ? "#a6b8ac" : "#4b5e51",
            borderRadius: 10,
            fontFamily: 'var(--font-inter), "Inter", system-ui, sans-serif',
          },
          // @ts-expect-error: Force disable cssVar to bypass App component warning
          cssVar: false,
        }}
      >
        <AntdApp component={false}>{children}</AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
