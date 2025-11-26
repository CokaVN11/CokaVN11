// ABOUTME: CTA section with calendar button and directions link
// ABOUTME: Horizontal layout on desktop, stacked on mobile with reveal animation

'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { AddToCalendarButton } from './AddToCalendarButton';
import { useReducedMotion } from '../hooks/useReducedMotion';
import {
  REVEAL_STAGGER,
  DURATION_60FPS,
  TRANSFORM_60FPS,
  EASING_60FPS,
} from '../config/animations';
import { eventConfig } from '@/data/graduation-event';

interface CTASectionProps {
  /** Whether reveal animations should play */
  isRevealed?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CTA Section with calendar and directions buttons
 *
 * - AddToCalendarButton with dropdown (existing)
 * - Get Directions link button (new)
 * - Horizontal layout desktop, stacked mobile
 * - GSAP reveal animation
 */
export function CTASection({ isRevealed = false, className = '' }: CTASectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Generate Google Maps directions URL
  const getDirectionsUrl = () => {
    const query = encodeURIComponent(eventConfig.venue.mapsQuery);
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  };

  // Reveal animation
  useEffect(() => {
    if (!isRevealed || !containerRef.current || shouldReduceMotion) return;

    const buttons = containerRef.current.querySelectorAll('.cta-button');

    gsap.fromTo(
      buttons,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: REVEAL_STAGGER.duration,
        ease: 'power3.out',
        stagger: REVEAL_STAGGER.ctaButtons,
        delay: REVEAL_STAGGER.baseDelay + REVEAL_STAGGER.infoCells * 3,
      }
    );
  }, [isRevealed, shouldReduceMotion]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-4 md:flex-row md:gap-6 ${className}`}
    >
      {/* Calendar Button */}
      <div
        className="cta-button"
        style={{ opacity: shouldReduceMotion ? 1 : 0 }}
      >
        <AddToCalendarButton eventConfig={eventConfig} />
      </div>

      {/* Get Directions Button */}
      <motion.a
        href={getDirectionsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="cta-button flex h-12 items-center justify-center gap-2 rounded-28 border border-grad-single-glass-20 bg-transparent px-6 font-body text-base font-medium text-grad-single-text transition-colors hover:bg-grad-single-glass-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-grad-single-blue-primary focus-visible:outline-offset-2 md:h-14"
        style={{ opacity: shouldReduceMotion ? 1 : 0 }}
        whileHover={
          shouldReduceMotion
            ? { opacity: 0.9 }
            : {
                scale: 1.02,
                y: TRANSFORM_60FPS.hoverLiftY,
              }
        }
        whileTap={
          shouldReduceMotion
            ? { opacity: 0.8 }
            : {
                scale: TRANSFORM_60FPS.pressScale,
                y: 0,
              }
        }
        transition={{
          duration: DURATION_60FPS.micro,
          ease: [...EASING_60FPS.easeOutEmphasized],
        }}
        data-cursor-hover
      >
        <svg
          className="h-5 w-5"
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
        <span>Get Directions</span>
      </motion.a>
    </div>
  );
}
