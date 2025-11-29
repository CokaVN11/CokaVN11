// ABOUTME: Floating name overlay positioned over the hero canvas
// ABOUTME: Uses mix-blend-mode soft-light for harmonious aurora integration

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { REVEAL_STAGGER } from '../config/animations';
import { eventConfig } from '@/data/graduation-event';

interface FloatingNameProps {
  /** Whether reveal animation should play */
  isRevealed?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Container variants - orchestrates staggered children
 */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: REVEAL_STAGGER.floatingName,
      staggerChildren: 0.03,
    },
  },
};

/**
 * Character variants - each letter animates up with fade
 */
const charVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: REVEAL_STAGGER.duration,
      ease: [0.33, 1, 0.68, 1] as const, // power3.out equivalent
    },
  },
};

/**
 * Floating name overlay component
 *
 * - Positioned absolute over the left (visual) panel
 * - Name in Oswald uppercase with large size
 * - Mix-blend-mode: soft-light for harmonious aurora integration
 * - Framer Motion staggered character reveal
 */
export function FloatingName({ isRevealed = false, className = '' }: FloatingNameProps) {
  const shouldReduceMotion = useReducedMotion();

  // Split name into characters for animation
  const nameParts = eventConfig.graduate.fullName.toUpperCase().split(' ');

  // Skip animation for reduced motion
  if (shouldReduceMotion) {
    return (
      <div
        className={`pointer-events-none absolute inset-0 flex flex-col items-start justify-center px-8 md:px-16 ${className}`}
        style={{ mixBlendMode: 'soft-light' }}
        aria-hidden="true"
      >
        {nameParts.map((part, partIndex) => (
          <div key={partIndex} className="pt-5 overflow-hidden">
            <span className="block text-4xl font-bold leading-[1.2] tracking-tight text-white font-display md:text-6xl lg:text-7xl">
              {part}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 flex flex-col items-start justify-center px-8 md:px-16 ${className}`}
      style={{ mixBlendMode: 'soft-light' }}
      aria-hidden="true"
      variants={containerVariants}
      initial="hidden"
      animate={isRevealed ? 'visible' : 'hidden'}
    >
      {nameParts.map((part, partIndex) => (
        <div key={partIndex} className="pt-5 overflow-hidden">
          <span className="block text-4xl font-bold leading-[1.2] tracking-tight text-white font-display md:text-6xl lg:text-7xl">
            {part.split('').map((char, charIndex) => (
              <motion.span
                key={`${partIndex}-${charIndex}`}
                className="inline-block"
                variants={charVariants}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
