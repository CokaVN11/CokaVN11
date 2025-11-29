// ABOUTME: Reusable info cell component with glass card styling
// ABOUTME: Supports icons, click actions, and spring-based reveal animations

'use client';

import { type ReactNode, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { REVEAL_STAGGER } from '../config/animations';

interface InfoCellProps {
  /** Small uppercase label */
  label: string;
  /** Large display value */
  value: string;
  /** Optional smaller subtext */
  subtext?: string;
  /** Whether reveal animation should play */
  isRevealed?: boolean;
  /** Animation delay offset */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
  /** Optional icon displayed next to label */
  icon?: ReactNode;
  /** Whether the cell is clickable */
  isClickable?: boolean;
  /** Click handler for interactive cells */
  onClick?: () => void;
  /** Action hint text shown on hover (e.g., "Tap to open maps") */
  actionHint?: string;
  /** Aria label for accessibility */
  ariaLabel?: string;
}

/**
 * Spring animation variants for cell reveal
 */
const cellVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 20,
      delay: REVEAL_STAGGER.baseDelay + delay,
    },
  }),
};

/**
 * Info cell component for displaying event details
 *
 * - Glass card styling with backdrop blur
 * - Optional icon next to label
 * - Hover effects for interactive cells
 * - Spring-based reveal animations
 * - Keyboard accessible when clickable
 */
export function InfoCell({
  label,
  value,
  subtext,
  isRevealed = false,
  delay = 0,
  className = '',
  icon,
  isClickable = false,
  onClick,
  actionHint,
  ariaLabel,
}: InfoCellProps) {
  const shouldReduceMotion = useReducedMotion();

  // Handle keyboard activation for clickable cells
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (isClickable && onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onClick();
      }
    },
    [isClickable, onClick]
  );

  // Build class names based on state - Aurora glow styling
  const baseClasses = `
    group
    relative
    flex flex-col gap-2
    p-6
    rounded-xl
    border border-white/5
    bg-white/[0.02]
    transition-all duration-500
  `;

  // Aurora glow on hover (pink/purple from sunset palette)
  const hoverClasses = `
    hover:border-white/10
    hover:bg-white/[0.04]
    hover:shadow-[0_0_40px_-10px_rgba(217,64,140,0.3),0_0_80px_-20px_rgba(115,38,166,0.2)]
  `;

  const focusClasses = `
    focus-visible:outline-2
    focus-visible:outline-offset-2
    focus-visible:outline-grad-single-blue-primary
  `;

  const clickableClasses = isClickable ? 'cursor-pointer' : '';

  const combinedClasses = `${baseClasses} ${hoverClasses} ${focusClasses} ${clickableClasses} ${className}`.trim();

  // Interactive props for clickable cells
  const interactiveProps = isClickable
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onClick,
        onKeyDown: handleKeyDown,
        'aria-label': ariaLabel,
      }
    : {};

  // Content wrapper
  const content = (
    <>
      {/* Label with optional icon */}
      <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
        {/* Icon with aurora color on hover */}
        <span className="transition-colors duration-500 group-hover:text-[#D9408C]/70">
          {icon}
        </span>
        {label}
      </span>

      {/* Large value - warmer white for dark mode */}
      <span className="font-display text-3xl font-semibold text-[#f8f8f8] md:text-4xl">
        {value}
      </span>

      {/* Optional subtext - slightly brighter for readability */}
      {subtext && (
        <span className="text-base text-white/55">{subtext}</span>
      )}

      {/* Action hint (appears on hover for clickable cells) */}
      {isClickable && actionHint && (
        <span
          className="
            pointer-events-none
            absolute right-6 top-1/2 -translate-y-1/2
            flex items-center gap-1
            text-xs text-white/45
            opacity-0 translate-x-2
            group-hover:opacity-100 group-hover:translate-x-0
            group-hover:text-[#D9408C]/70
            transition-all duration-500
          "
          aria-hidden="true"
        >
          {actionHint}
          <ArrowRightIcon />
        </span>
      )}
    </>
  );

  // Use motion wrapper for animations, or plain div for reduced motion
  if (shouldReduceMotion) {
    return (
      <div className={combinedClasses} {...interactiveProps}>
        {content}
      </div>
    );
  }

  return (
    <motion.div
      className={combinedClasses}
      variants={cellVariants}
      initial="hidden"
      animate={isRevealed ? 'visible' : 'hidden'}
      custom={delay}
      {...interactiveProps}
    >
      {content}
    </motion.div>
  );
}

/**
 * Small arrow icon for action hints
 */
function ArrowRightIcon() {
  return (
    <svg
      className="h-3 w-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

/**
 * Calendar icon for date cells
 */
export function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}

/**
 * Clock icon for time cells
 */
export function ClockIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

/**
 * Map pin icon for location cells
 */
export function MapPinIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}
