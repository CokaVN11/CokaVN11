// ABOUTME: Floating name overlay positioned over the hero canvas
// ABOUTME: Uses mix-blend-mode difference for visibility on any background

'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
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
 * Floating name overlay component
 *
 * - Positioned absolute over the left (visual) panel
 * - Name in Oswald uppercase with large size
 * - Mix-blend-mode: difference for visibility
 * - GSAP reveal animation on load
 */
export function FloatingName({ isRevealed = false, className = '' }: FloatingNameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Reveal animation
  useEffect(() => {
    if (!isRevealed || !containerRef.current || shouldReduceMotion) return;

    const chars = containerRef.current.querySelectorAll('.char');

    gsap.fromTo(
      chars,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: REVEAL_STAGGER.duration,
        ease: 'power3.out',
        stagger: 0.03,
        delay: REVEAL_STAGGER.floatingName,
      }
    );
  }, [isRevealed, shouldReduceMotion]);

  // Split name into characters for animation
  const nameParts = eventConfig.graduate.fullName.toUpperCase().split(' ');

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 flex flex-col items-start justify-center px-8 md:px-16 ${className}`}
      style={{ mixBlendMode: 'difference' }}
      aria-hidden="true"
    >
      {nameParts.map((part, partIndex) => (
        <div key={partIndex} className="overflow-hidden">
          <span
            className="block font-display text-4xl font-bold leading-none tracking-tight text-white md:text-6xl lg:text-7xl"
            style={{ opacity: shouldReduceMotion ? 1 : 0 }}
          >
            {part.split('').map((char, charIndex) => (
              <span
                key={`${partIndex}-${charIndex}`}
                className="char inline-block"
                style={{ opacity: shouldReduceMotion ? 1 : undefined }}
              >
                {char}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
