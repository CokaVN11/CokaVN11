import { useState, useEffect } from "react";
import { getTheme, setTheme, toggleTheme, type Theme } from "./theme";

export function useTheme() {
  const [theme, setLocalTheme] = useState<Theme>(getTheme);

  useEffect(() => {
    const handler = (e: Event) => {
      setLocalTheme((e as CustomEvent<Theme>).detail);
    };
    document.addEventListener("theme-change", handler);
    return () => document.removeEventListener("theme-change", handler);
  }, []);

  return { theme, setTheme, toggleTheme };
}
