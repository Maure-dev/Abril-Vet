import { THEME_STORAGE_KEY } from "@app/modules/main/constants/constants";
import type { ThemeType } from "@app/modules/main/entities/entities";
import { useCallback, useEffect, useState } from "react";

// Lee el tema guardado; si no hay, respeta la preferencia del sistema.
function readInitialTheme(): ThemeType {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

// Aplica el tema al <html> (data-theme) y lo persiste. El CSS resuelve los tokens por atributo.
function applyTheme(theme: ThemeType): void {
  document.documentElement.setAttribute("data-theme", theme);
}

// Hook compartido de tema (modo claro/oscuro). Único punto que muta data-theme.
export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeType>(readInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemeType): void => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback((): void => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme: theme, setTheme: setTheme, toggleTheme: toggleTheme };
};
