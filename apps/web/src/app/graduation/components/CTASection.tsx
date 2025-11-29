// ABOUTME: CTA section with calendar button and directions link
// ABOUTME: Centered layout with Framer Motion stagger, aurora glow on hover

'use client';

import { motion } from 'framer-motion';
import { AddToCalendarButton } from './AddToCalendarButton';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLocale } from '../hooks/useLocale';
import { DURATION_60FPS, TRANSFORM_60FPS, EASING_60FPS } from '../config/animations';
import { eventConfig } from '@/data/graduation-event';

interface CTASectionProps {
  /** Whether reveal animations should play */
  isRevealed?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Staggered reveal animation variants (continues from InfoGrid)
 * InfoGrid uses indices 0-6, CTA uses 7-8
 */
const buttonVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 1.05 + i * 0.15, // Continue from InfoGrid (7 items × 0.15s = 1.05s)
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

/**
 * CTA Section with calendar and directions buttons
 *
 * - AddToCalendarButton with dropdown
 * - Get Directions link button with aurora glow
 * - Centered layout, horizontal on desktop
 * - Framer Motion stagger (continues from InfoGrid)
 */
export function CTASection({ isRevealed = false, className = '' }: CTASectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLocale();

  // Generate Google Maps directions URL
  const getDirectionsUrl = () => {
    const query = encodeURIComponent(eventConfig.venue.mapsQuery);
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  };

  // Animation wrapper component
  const AnimatedItem = ({
    children,
    index,
    className: itemClassName = '',
  }: {
    children: React.ReactNode;
    index: number;
    className?: string;
  }) => {
    if (shouldReduceMotion) {
      return <div className={itemClassName}>{children}</div>;
    }

    return (
      <motion.div
        className={itemClassName}
        variants={buttonVariants}
        initial="hidden"
        animate={isRevealed ? 'visible' : 'hidden'}
        custom={index}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div
      className={`flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-6 ${className}`}
    >
      {/* Calendar Button */}
      <AnimatedItem index={0}>
        <AddToCalendarButton eventConfig={eventConfig} />
      </AnimatedItem>
    </div>
  );
}
