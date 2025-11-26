// ABOUTME: Reusable hook for common 60fps micro-interaction patterns
// ABOUTME: Provides pre-configured motion props for buttons, cards, and icons

'use client';

import { useReducedMotion } from './useReducedMotion';
import { DURATION_60FPS, EASING_60FPS, SPRING_60FPS, TRANSFORM_60FPS } from '../config/animations';
import type { MotionProps } from 'framer-motion';

type InteractionType = 'button' | 'card' | 'icon';

interface MicroInteractionConfig {
  type: InteractionType;
  /** Optional custom hover scale (default: 1.02 for button, 1 for card/icon) */
  hoverScale?: number;
  /** Optional custom press scale (default: 0.98) */
  pressScale?: number;
  /** Enable spring physics (default: false for button, true for card/icon) */
  useSpring?: boolean;
}

/**
 * Returns pre-configured Framer Motion props for common micro-interactions
 * Automatically respects user's reduced motion preference
 *
 * @param config - Configuration object for interaction type and behavior
 * @returns MotionProps object ready to spread onto motion components
 *
 * @example Button with press depth
 * ```tsx
 * const buttonProps = useMicroInteraction({ type: 'button' });
 * return <motion.button {...buttonProps}>Click me</motion.button>;
 * ```
 *
 * @example Card with spring wobble
 * ```tsx
 * const cardProps = useMicroInteraction({ type: 'card', useSpring: true });
 * return <motion.div {...cardProps}>Card content</motion.div>;
 * ```
 *
 * @example Icon with pulse
 * ```tsx
 * const iconProps = useMicroInteraction({ type: 'icon' });
 * return <motion.span {...iconProps}>💡</motion.span>;
 * ```
 */
export function useMicroInteraction(config: MicroInteractionConfig): Partial<MotionProps> {
  const shouldReduceMotion = useReducedMotion();

  // Reduced motion fallback: simple opacity changes only
  if (shouldReduceMotion) {
    return {
      whileHover: { opacity: 0.9 },
      whileTap: { opacity: 0.8 },
      transition: { duration: DURATION_60FPS.micro },
    };
  }

  // Button interactions: press depth with lift on hover
  if (config.type === 'button') {
    const hoverScale = config.hoverScale ?? 1.02;
    const pressScale = config.pressScale ?? TRANSFORM_60FPS.pressScale;

    return {
      whileHover: {
        scale: hoverScale,
        y: TRANSFORM_60FPS.hoverLiftY,
      },
      whileTap: {
        scale: pressScale,
        y: 0,
      },
      transition: config.useSpring
        ? SPRING_60FPS.buttonPress
        : {
            duration: DURATION_60FPS.micro,
            ease: EASING_60FPS.easeOutEmphasized as any,
          },
    };
  }

  // Card interactions: lift + rotation with optional spring wobble
  if (config.type === 'card') {
    const hoverScale = config.hoverScale ?? 1;
    const pressScale = config.pressScale ?? TRANSFORM_60FPS.pressScale;

    return {
      whileHover: {
        scale: hoverScale,
        y: TRANSFORM_60FPS.hoverLiftY,
        rotate: TRANSFORM_60FPS.cardRotate,
      },
      whileTap: {
        scale: pressScale,
      },
      transition: config.useSpring
        ? SPRING_60FPS.polaroidWobble
        : {
            duration: DURATION_60FPS.microLong,
            ease: EASING_60FPS.easeInOutStandard as any,
          },
    };
  }

  // Icon interactions: subtle pulse with spring
  if (config.type === 'icon') {
    return {
      whileHover: {
        scale: TRANSFORM_60FPS.iconPulse,
      },
      whileTap: {
        scale: 0.95,
      },
      transition: config.useSpring
        ? SPRING_60FPS.paperSettle
        : {
            duration: DURATION_60FPS.micro,
            ease: EASING_60FPS.easeOutSoft as any,
          },
    };
  }

  // Default fallback
  return {};
}

/**
 * Pre-configured motion props for common use cases
 * Use these for quick implementation without calling useMicroInteraction
 */
export const MICRO_PRESETS = {
  /** Standard button with press depth */
  button: {
    whileHover: { scale: 1.02, y: TRANSFORM_60FPS.hoverLiftY },
    whileTap: { scale: TRANSFORM_60FPS.pressScale, y: 0 },
    transition: { duration: DURATION_60FPS.micro, ease: EASING_60FPS.easeOutEmphasized as any },
  },

  /** Card with spring wobble */
  cardSpring: {
    whileHover: { y: TRANSFORM_60FPS.hoverLiftY, rotate: TRANSFORM_60FPS.cardRotate },
    whileTap: { scale: TRANSFORM_60FPS.pressScale },
    transition: SPRING_60FPS.polaroidWobble,
  },

  /** Icon with pulse */
  iconPulse: {
    whileHover: { scale: TRANSFORM_60FPS.iconPulse },
    whileTap: { scale: 0.95 },
    transition: { duration: DURATION_60FPS.micro, ease: EASING_60FPS.easeOutSoft as any },
  },

  /** Paper note with wobble */
  paperWobble: {
    whileHover: { rotate: TRANSFORM_60FPS.cardRotateExtended },
    transition: SPRING_60FPS.paperSettle,
  },
} as const;
