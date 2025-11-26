// ABOUTME: Custom hook to detect user's motion preference for accessibility
// ABOUTME: Returns true if user has enabled "prefers-reduced-motion" in their system settings

'use client';

import { useState, useEffect } from 'react';

/**
 * Detects if user prefers reduced motion for accessibility
 * Respects system-level accessibility settings
 *
 * @returns boolean - true if reduced motion is preferred
 *
 * @example
 * ```tsx
 * const shouldReduceMotion = useReducedMotion();
 *
 * return (
 *   <motion.div
 *     animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
 *   />
 * );
 * ```
 */
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check if matchMedia is supported (for SSR compatibility)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setShouldReduceMotion(mediaQuery.matches);

    // Listen for changes to user preference
    const handleChange = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches);
    };

    // Modern browsers use addEventListener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return shouldReduceMotion;
}
