// ABOUTME: Parking information note with minimal text styling
// ABOUTME: Centered layout with Framer Motion stagger integration

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLocale } from '../hooks/useLocale';

interface ParkingNoteProps {
  /** Whether reveal animations should play */
  isRevealed?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Staggered reveal animation variants (continues from CTA buttons)
 * InfoGrid uses 0-6, CTA uses 7-8, ParkingNote uses 9
 */
const noteVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 1.35 + 0.15, // Continue from CTA (1.05 + 0.3 = 1.35s, then +0.15s)
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

/**
 * Parking note with minimal text styling
 *
 * - Subtle white/40 text (matches InfoGrid muted elements)
 * - Centered layout
 * - Framer Motion stagger (continues from CTA)
 */
export function ParkingNote({ isRevealed = false, className = '' }: ParkingNoteProps) {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLocale();

  if (shouldReduceMotion) {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <span className="text-base text-white/40">💡</span>
        <p className="text-sm text-white/40">{t.parkingNote}</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`flex items-center justify-center gap-2 ${className}`}
      variants={noteVariants}
      initial="hidden"
      animate={isRevealed ? 'visible' : 'hidden'}
    >
      <span className="text-base text-white/40">💡</span>
      <p className="text-sm text-white/40">{t.parkingNote}</p>
    </motion.div>
  );
}
