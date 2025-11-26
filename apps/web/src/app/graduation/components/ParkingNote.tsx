// ABOUTME: Parking information note with lightbulb icon and soft yellow background
// ABOUTME: WCAG AAA compliant colors (8.2:1 contrast ratio) with 60fps paper wobble

'use client';

import { motion } from 'framer-motion';
import {
  EASING,
  DURATION,
  TRANSFORM_60FPS,
} from '../config/animations';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function ParkingNote() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex items-start gap-3 max-w-[320px] md:max-w-[500px] px-4 py-3 md:px-5 md:py-4 bg-grad-single-yellow-bg border border-grad-single-yellow-border rounded-xl will-change-transform cursor-default"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATION.default,
        delay: 0.4,
        ease: EASING.default as any,
      }}
      // 60fps paper wobble on hover with spring settle
      whileHover={
        shouldReduceMotion
          ? { opacity: 0.95 }
          : {
              rotate: TRANSFORM_60FPS.cardRotateExtended,
            }
      }
    >
      <motion.span
        className="text-2xl flex-shrink-0 leading-none inline-block"
        // 60fps ambient pulse (gentle, infinite)
        animate={
          shouldReduceMotion
            ? { scale: 1 }
            : {
                scale: [1, TRANSFORM_60FPS.iconPulse, 1],
              }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      >
        💡
      </motion.span>
      <p className="font-body text-[13px] md:text-sm font-normal leading-normal text-grad-single-yellow-text m-0">
        Nên gửi xe ngoài trường hoặc đi Grab cho tiện nhé!
      </p>
    </motion.div>
  );
}
