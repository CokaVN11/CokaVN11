import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';

// Pokemon GBA-style animation constants
export const POKEMON_TIMING = {
  fast: 150, // Fast menu transitions
  normal: 200, // Standard panel transitions
  slow: 250, // Screen wipe transitions
} as const;

export const POKEMON_EASING = {
  // GBA-style easeOutExpo approximation
  expoOut: [0.16, 1, 0.3, 1],
  // Sharp, snappy transitions for menu interactions
  snappy: [0.25, 0.46, 0.45, 0.94],
  // Smooth screen transitions
  smooth: [0.4, 0, 0.2, 1],
} as const;

// Pokemon-style color palette
export const POKEMON_COLORS = {
  // FireRed/LeafGreen inspired colors
  red: '#FF6B6B',
  green: '#4ECDC4',
  blue: '#45B7D1',
  yellow: '#FFD93D',
  purple: '#9B59B6',
  white: '#FFFFFF',
  black: '#2C3E50',
  gray: '#95A5A6',
} as const;

// Check for reduced motion preference
export const useReducedMotion = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return shouldReduceMotion;
};

// Base animation props with reduced motion support
export const createAnimationProps = (
  duration: number,
  easing: string[],
  reducedMotion?: boolean
) => ({
  transition: {
    duration: reducedMotion ? 0 : duration / 1000,
    ease: easing,
  },
  ...(reducedMotion && { initial: false, animate: true }),
});

// Pokemon-style panel slide-in variants
export const panelVariants = {
  hidden: {
    x: '-100%',
    opacity: 0,
    filter: 'blur(4px)',
  },
  visible: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: POKEMON_TIMING.normal / 1000,
      ease: POKEMON_EASING.expoOut,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    filter: 'blur(4px)',
    transition: {
      duration: POKEMON_TIMING.fast / 1000,
      ease: POKEMON_EASING.snappy,
    },
  },
};

// Wipe effect variants for screen transitions
export const wipeVariants = {
  hidden: {
    clipPath: 'inset(0 100% 0 0)',
  },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: {
      duration: POKEMON_TIMING.slow / 1000,
      ease: POKEMON_EASING.smooth,
    },
  },
  exit: {
    clipPath: 'inset(0 0% 0 100%)',
    transition: {
      duration: POKEMON_TIMING.slow / 1000,
      ease: POKEMON_EASING.smooth,
    },
  },
};

// Button hover states with GBA-style timing
export const buttonVariants = {
  idle: {
    scale: 1,
    backgroundColor: POKEMON_COLORS.blue,
  },
  hover: {
    scale: 1.05,
    backgroundColor: POKEMON_COLORS.green,
    transition: {
      duration: POKEMON_TIMING.fast / 1000,
      ease: POKEMON_EASING.snappy,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 50 / 1000,
      ease: POKEMON_EASING.snappy,
    },
  },
};

// Text reveal animation (Pokemon-style dialogue)
export const textRevealVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: POKEMON_TIMING.normal / 1000,
      ease: POKEMON_EASING.expoOut,
    },
  },
};

// Staggered children animation (for lists/menus)
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 50 / 1000, // 50ms stagger
      delayChildren: 100 / 1000, // 100ms delay
    },
  },
};

export const staggerItem = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: POKEMON_TIMING.fast / 1000,
      ease: POKEMON_EASING.snappy,
    },
  },
};

// Pokemon-style notification/toast animation
export const notificationVariants = {
  hidden: {
    y: '-100%',
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: POKEMON_TIMING.normal / 1000,
      ease: POKEMON_EASING.expoOut,
    },
  },
  exit: {
    y: '-100%',
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: POKEMON_TIMING.fast / 1000,
      ease: POKEMON_EASING.snappy,
    },
  },
};

// Page transition variants
export const pageVariants = {
  hidden: {
    opacity: 0,
    x: 100,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: POKEMON_TIMING.normal / 1000,
      ease: POKEMON_EASING.expoOut,
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    filter: 'blur(8px)',
    transition: {
      duration: POKEMON_TIMING.fast / 1000,
      ease: POKEMON_EASING.snappy,
    },
  },
};

// Theme switching animation
export const themeVariants = {
  light: {
    backgroundColor: POKEMON_COLORS.white,
    color: POKEMON_COLORS.black,
  },
  dark: {
    backgroundColor: POKEMON_COLORS.black,
    color: POKEMON_COLORS.white,
    transition: {
      duration: POKEMON_TIMING.slow / 1000,
      ease: POKEMON_EASING.smooth,
    },
  },
};

// Game Boy-style pixelated border animation
export const pixelBorderVariants = {
  idle: {
    boxShadow: `
      inset -4px -4px 0px 0px rgba(0,0,0,0.1),
      inset 4px 4px 0px 0px rgba(255,255,255,0.1)
    `,
  },
  active: {
    boxShadow: `
      inset -2px -2px 0px 0px rgba(0,0,0,0.2),
      inset 2px 2px 0px 0px rgba(255,255,255,0.2)
    `,
    transition: {
      duration: 100 / 1000,
      ease: POKEMON_EASING.snappy,
    },
  },
};

// Custom hook for managing animation state
export const useAnimationState = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = () => setIsAnimating(true);
  const endAnimation = () => setIsAnimating(false);

  return { isAnimating, startAnimation, endAnimation };
};
