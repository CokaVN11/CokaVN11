/**
 * Theme configuration types for Pokemon FireRed/LeafGreen theme system
 *
 * This file defines the TypeScript interfaces for the GBA Theme Migration feature.
 * It provides type safety for theme configuration, color tokens, and user preferences.
 */

export type ThemeType = 'fire' | 'leaf';

export interface ColorTokenSet {
  /** Primary ink color for outlines and borders */
  ink: string;

  /** Primary accent color */
  primary: string;

  /** Secondary accent color */
  secondary: string;

  /** Background color */
  background: string;

  /** Call-to-action highlight color */
  cta: string;
}

export interface ColorSystem {
  /** FireRed theme colors */
  fire: ColorTokenSet;

  /** LeafGreen theme colors */
  leaf: ColorTokenSet;
}

export interface AnimationSettings {
  /** Whether animations are enabled */
  enabled: boolean;

  /** Quality level based on device capabilities */
  quality: 'high' | 'medium' | 'low';

  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
}

export interface AccessibilitySettings {
  /** High contrast mode preference */
  highContrast: boolean;

  /** Font size multiplier */
  fontSizeMultiplier: number;
}

export interface ThemeConfiguration {
  /** Current active theme */
  currentTheme: ThemeType;

  /** Animation settings */
  animationSettings: AnimationSettings;

  /** User accessibility preferences */
  accessibility: AccessibilitySettings;

  /** Metadata */
  lastUpdated: string;
  version: string;
}

export interface ThemeToggleRequest {
  theme: ThemeType;
}

export interface ThemeToggleResponse {
  success: boolean;
  previousTheme: ThemeType;
  newTheme: ThemeType;
  timestamp: string;
}

export interface ThemeChangeEvent {
  type: 'theme_changed' | 'animation_settings_changed' | 'accessibility_settings_changed';
  payload: ThemeToggleResponse | AnimationSettings | AccessibilitySettings;
  timestamp: string;
}
