// ABOUTME: Marquee footer with infinite scrolling text
// ABOUTME: Fixed to bottom with i18n support and high contrast design

'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Marquee } from '@/components/ui/marquee';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLocale } from '../hooks/useLocale';
import { REVEAL_STAGGER } from '../config/animations';
import { eventConfig } from '@/data/graduation-event';

interface MarqueeFooterProps {
  /** Whether reveal animation should play */
  isRevealed?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Marquee footer component
 *
 * - Fixed to bottom of viewport
 * - White background, black text (contrast with dark page)
 * - Infinite scrolling animation
 * - Content: Class of 2025, degree, school name
 */
export function MarqueeFooter({ isRevealed = false, className = '' }: MarqueeFooterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { t, interpolate } = useLocale();

  const { graduate } = eventConfig;

  // Extract year from event date
  const graduationYear = new Date(eventConfig.event.dateISO).getFullYear();

  // Reveal animation
  useEffect(() => {
    if (!isRevealed || !containerRef.current || shouldReduceMotion) return;

    gsap.fromTo(
      containerRef.current,
      { y: '100%', opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: REVEAL_STAGGER.duration,
        ease: 'power3.out',
        delay: REVEAL_STAGGER.marquee,
      }
    );
  }, [isRevealed, shouldReduceMotion]);

  // Marquee items with i18n
  const marqueeItems = [
    interpolate(t.classOf, { year: graduationYear }),
    '•',
    graduate.degree,
    '•',
    graduate.school,
    '•',
    graduate.fullName,
    '•',
  ];

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white ${className}`}
      style={{ opacity: shouldReduceMotion ? 1 : 0 }}
    >
      <Marquee className="py-3 [--duration:30s] [--gap:2rem]" pauseOnHover>
        {marqueeItems.map((item, index) => (
          <span
            key={index}
            className={`font-display text-sm font-medium uppercase tracking-[0.1em] ${
              item === '•' ? 'text-gray-400' : 'text-gray-900'
            }`}
          >
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
