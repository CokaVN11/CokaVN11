export type Theme = "dark" | "light";

const THEME_KEY = "theme";
const DEFAULT_THEME: Theme = "dark";
const SWITCHING_THEME_TIME = 160; // ms, should match the duration of theme-switching animation in CSS
const SWITCHING_THEME_CLASS = "theme-switching";
const SWITCHING_THEME_TIMEOUT = 400; // ms, a safe upper bound to remove the switching class in case of unexpected issues

let switching = false;
export const isSwitching = () => switching;

export function getTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return (document.documentElement.dataset.theme as Theme) ?? DEFAULT_THEME;
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  document.dispatchEvent(new CustomEvent("theme-change", { detail: theme }));
}

export function toggleTheme(): void {
  if (switching) return;
  switching = true;
  document.documentElement.classList.add(SWITCHING_THEME_CLASS);
  setTimeout(() => {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  }, SWITCHING_THEME_TIME);
  setTimeout(() => {
    switching = false;
    document.documentElement.classList.remove(SWITCHING_THEME_CLASS);
  }, SWITCHING_THEME_TIMEOUT);
}

/** Call once synchronously in <head> to restore persisted theme before hydration */
export function initTheme(): void {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  document.documentElement.dataset.theme = stored ?? DEFAULT_THEME;
}
