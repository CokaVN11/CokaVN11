// ABOUTME: Full-screen loading overlay with animated counter
// ABOUTME: Slides up to reveal content when loading completes

'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLoadingCounter } from '../hooks/useLoadingCounter';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { LOADER_CONFIG } from '../config/animations';

interface LoadingScreenProps {
  /** Callback when loading is complete and exit animation finished */
  onComplete?: () => void;
  /** Minimum display time in ms (prevents flash for fast loads) */
  minDisplayTime?: number;
}

/**
 * Loading screen with animated counter and slide-up exit
 * - Displays 0-100 counter animation
 * - Slides up to reveal content when complete
 * - Respects reduced motion preferences
 */
export function LoadingScreen({
  onComplete,
  minDisplayTime = 500,
}: LoadingScreenProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isExiting, setIsExiting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  const handleCounterComplete = () => {
    // Prevent double triggering
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Start exit animation after delay
    setTimeout(() => {
      setIsExiting(true);

      if (shouldReduceMotion) {
        // Instant hide for reduced motion
        setIsHidden(true);
        onComplete?.();
        return;
      }

      // GSAP exit animation
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          y: '-100%',
          duration: LOADER_CONFIG.exitDuration,
          ease: LOADER_CONFIG.exitEase,
          onComplete: () => {
            setIsHidden(true);
            onComplete?.();
          },
        });
      }
    }, LOADER_CONFIG.exitDelay * 1000);
  };

  const { count, isComplete } = useLoadingCounter({
    onComplete: handleCounterComplete,
  });

  // Handle minimum display time
  useEffect(() => {
    if (shouldReduceMotion) {
      // Skip loading animation for reduced motion
      const timer = setTimeout(() => {
        setIsHidden(true);
        onComplete?.();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldReduceMotion, onComplete]);

  // Don't render if hidden
  if (isHidden) {
    return null;
  }

  // Format count with leading zero
  const displayCount = count.toString().padStart(2, '0');

  return (
    <div
      ref={overlayRef}
      className="loader-overlay"
      role="progressbar"
      aria-valuenow={count}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading graduation invitation"
    >
      {/* Counter display */}
      <div className="relative flex items-baseline">
        <span
          className="font-display text-[20vw] font-bold leading-none text-white md:text-[15vw]"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {displayCount}
        </span>
        <span className="ml-2 font-display text-[5vw] font-light text-white/50 md:text-[3vw]">
          %
        </span>
      </div>

      {/* Loading text */}
      <p className="absolute bottom-12 left-1/2 -translate-x-1/2 font-body text-sm uppercase tracking-[0.3em] text-white/40">
        Loading
      </p>
    </div>
  );
}
