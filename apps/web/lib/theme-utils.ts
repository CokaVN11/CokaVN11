/**
 * Theme utility functions for Pokemon FireRed/LeafGreen theme system
 *
 * This file provides utility functions for theme management, validation,
 * and localStorage operations for the GBA Theme Migration feature.
 */

import type {
  ThemeType,
  ThemeConfiguration,
  AnimationSettings,
  AccessibilitySettings,
  ThemeToggleResponse,
} from './theme-types';

// Storage key for theme configuration
export const THEME_STORAGE_KEY = 'pokemon-theme';

// Default theme configuration
export const DEFAULT_THEME_CONFIG: ThemeConfiguration = {
  currentTheme: 'fire',
  animationSettings: {
    enabled: true,
    quality: 'high',
    prefersReducedMotion: false,
  },
  accessibility: {
    highContrast: false,
    fontSizeMultiplier: 1.0,
  },
  lastUpdated: new Date().toISOString(),
  version: '1.0.0',
};

// Pokemon FireRed color palette
export const FIRE_COLORS = {
  ink: '#2A1301',
  primary: '#E23C2A',
  secondary: '#FF9E00',
  background: '#FFF3D4',
  cta: '#FFD93D',
};

// Pokemon LeafGreen color palette
export const LEAF_COLORS = {
  ink: '#183D2B',
  primary: '#4CAF50',
  secondary: '#8BC34A',
  background: '#E7F5D9',
  cta: '#FDD835',
};

/**
 * Validates if a given theme type is valid
 */
export const isValidTheme = (theme: string): theme is ThemeType => {
  return ['fire', 'leaf'].includes(theme);
};

/**
 * Validates if a hex color is valid
 */
export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

/**
 * Gets the appropriate colors for the given theme
 */
export const getThemeColors = (theme: ThemeType) => {
  return theme === 'fire' ? FIRE_COLORS : LEAF_COLORS;
};

/**
 * Validates and normalizes theme configuration
 */
export const validateThemeConfiguration = (
  config: Partial<ThemeConfiguration>
): ThemeConfiguration => {
  const validated = { ...DEFAULT_THEME_CONFIG, ...config };

  // Validate theme type
  if (!isValidTheme(validated.currentTheme)) {
    validated.currentTheme = 'fire';
  }

  // Validate animation quality
  if (
    validated.animationSettings.quality &&
    !['high', 'medium', 'low'].includes(validated.animationSettings.quality)
  ) {
    validated.animationSettings.quality = 'high';
  }

  // Validate font size multiplier
  if (
    validated.accessibility.fontSizeMultiplier < 0.8 ||
    validated.accessibility.fontSizeMultiplier > 2.0
  ) {
    validated.accessibility.fontSizeMultiplier = 1.0;
  }

  // Update timestamp
  validated.lastUpdated = new Date().toISOString();

  return validated;
};

/**
 * Saves theme configuration to localStorage
 */
export const saveThemeConfiguration = (config: ThemeConfiguration): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
  }
};

/**
 * Loads theme configuration from localStorage
 */
export const loadThemeConfiguration = (): ThemeConfiguration => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return validateThemeConfiguration(parsed);
    }
  } catch (error) {
    console.warn('Failed to load theme preference:', error);
  }
  return DEFAULT_THEME_CONFIG;
};

/**
 * Detects if user prefers reduced motion
 */
export const detectReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Gets animation duration based on quality and reduced motion preferences
 */
export const getAnimationDuration = (
  baseDuration: number,
  quality: AnimationSettings['quality'],
  prefersReduced: boolean
): number => {
  if (prefersReduced) return 0;

  const qualityMultipliers = {
    high: 1.0,
    medium: 0.8,
    low: 0.6,
  };

  return baseDuration * qualityMultipliers[quality];
};

/**
 * Pokemon-style animation timing functions
 */
export const ANIMATION_EASINGS = {
  expoOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
};

/**
 * Pokemon-style animation durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 200,
  slow: 250,
  panelSlide: 200,
  themeSwitch: 300,
  hover: 150,
  press: 100,
};

/**
 * Generates CSS custom properties for a theme
 */
export const generateThemeCSSVariables = (theme: ThemeType) => {
  const colors = getThemeColors(theme);
  return {
    '--color-ink': colors.ink,
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-background': colors.background,
    '--color-cta': colors.cta,
  };
};

/**
 * Validates theme switching request
 */
export const validateThemeToggle = (request: {
  theme: unknown;
}): { valid: boolean; theme?: ThemeType; error?: string } => {
  if (!request || typeof request.theme !== 'string') {
    return { valid: false, error: 'Theme is required and must be a string' };
  }

  if (!isValidTheme(request.theme)) {
    return { valid: false, error: 'Invalid theme. Must be "fire" or "leaf"' };
  }

  return { valid: true, theme: request.theme };
};

/**
 * Creates a theme toggle response
 */
export const createThemeToggleResponse = (
  previousTheme: ThemeType,
  newTheme: ThemeType,
  success: boolean = true
): ThemeToggleResponse => ({
  success,
  previousTheme,
  newTheme,
  timestamp: new Date().toISOString(),
});

/**
 * Updates animation settings with device detection
 */
export const updateAnimationSettings = (settings: AnimationSettings): AnimationSettings => {
  return {
    ...settings,
    prefersReducedMotion: detectReducedMotion(),
  };
};