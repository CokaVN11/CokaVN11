export type Theme = "dark" | "light"

const THEME_KEY = "theme"
const DEFAULT_THEME: Theme = "dark"

export function getTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME
  return (document.documentElement.dataset.theme as Theme) ?? DEFAULT_THEME
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  localStorage.setItem(THEME_KEY, theme)
  document.dispatchEvent(new CustomEvent("theme-change", { detail: theme }))
}

export function toggleTheme(): void {
  setTheme(getTheme() === "dark" ? "light" : "dark")
}

/** Call once synchronously in <head> to restore persisted theme before hydration */
export function initTheme(): void {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null
  document.documentElement.dataset.theme = stored ?? DEFAULT_THEME
}
