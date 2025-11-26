// ABOUTME: Reusable info cell component for the info grid
// ABOUTME: Displays label, value, and optional subtext with reveal animation

'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
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
}

/**
 * Info cell component for displaying event details
 *
 * - Label in xs uppercase with tracking
 * - Value in 2xl display font
 * - Optional subtext below value
 * - GSAP reveal animation
 */
export function InfoCell({
  label,
  value,
  subtext,
  isRevealed = false,
  delay = 0,
  className = '',
}: InfoCellProps) {
  const cellRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Reveal animation
  useEffect(() => {
    if (!isRevealed || !cellRef.current || shouldReduceMotion) return;

    const elements = cellRef.current.querySelectorAll('.reveal-item');

    gsap.fromTo(
      elements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: REVEAL_STAGGER.duration,
        ease: 'power3.out',
        stagger: 0.1,
        delay: REVEAL_STAGGER.baseDelay + delay,
      }
    );
  }, [isRevealed, delay, shouldReduceMotion]);

  return (
    <div
      ref={cellRef}
      className={`flex flex-col gap-2 ${className}`}
    >
      <span
        className="reveal-item text-xs uppercase tracking-[0.15em] text-grad-single-text-muted-50"
        style={{ opacity: shouldReduceMotion ? 1 : 0 }}
      >
        {label}
      </span>
      <span
        className="reveal-item font-display text-2xl font-medium text-grad-single-text md:text-3xl"
        style={{ opacity: shouldReduceMotion ? 1 : 0 }}
      >
        {value}
      </span>
      {subtext && (
        <span
          className="reveal-item text-sm text-grad-single-text-muted-60"
          style={{ opacity: shouldReduceMotion ? 1 : 0 }}
        >
          {subtext}
        </span>
      )}
    </div>
  );
}
