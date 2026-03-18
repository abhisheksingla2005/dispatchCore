/**
 * useTheme — Persistent dark/light/system mode hook
 *
 * Reads the initial theme from localStorage (key: "dc_theme").
 * Supports three modes: "dark", "light", and "system".
 * In "system" mode, follows the OS `prefers-color-scheme` preference
 * and reacts to live changes (e.g. scheduled dark mode).
 *
 * Toggles the "dark" class on <html> and persists changes.
 */

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

export type ThemeMode = "dark" | "light" | "system";

const STORAGE_KEY = "dc_theme";

/** Read the OS-level color scheme preference reactively. */
function getSystemDark(): boolean {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

function subscribeToSystemTheme(callback: () => void): () => void {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getInitialMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return "system";
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode);

  // Subscribe to OS theme changes so "system" mode reacts in real-time
  const systemDark = useSyncExternalStore(subscribeToSystemTheme, getSystemDark, () => false);

  // Resolve the effective dark/light state
  const isDark = mode === "system" ? systemDark : mode === "dark";

  // Apply dark class to <html> on mount and changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Persist mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  const setMode = useCallback((value: ThemeMode) => {
    setModeState(value);
  }, []);

  // Legacy setter for backward compatibility with pages that only toggle dark/light
  const setIsDark = useCallback((value: boolean) => {
    setModeState(value ? "dark" : "light");
  }, []);

  return { isDark, mode, setMode, setIsDark } as const;
}
