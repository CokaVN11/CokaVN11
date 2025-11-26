// ABOUTME: Hook for animated loading counter from 0 to 100
// ABOUTME: Uses GSAP for smooth number animation with configurable timing

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { LOADER_CONFIG } from '../config/animations';

interface UseLoadingCounterOptions {
  /** Duration of counter animation in seconds */
  duration?: number;
  /** Callback when counter reaches 100 */
  onComplete?: () => void;
  /** Delay before starting animation */
  startDelay?: number;
}

interface UseLoadingCounterReturn {
  /** Current counter value (0-100) */
  count: number;
  /** Whether counter has finished */
  isComplete: boolean;
  /** Manually reset the counter */
  reset: () => void;
}

/**
 * Animated loading counter hook using GSAP
 *
 * @param options - Configuration options
 * @returns Counter state and controls
 */
export function useLoadingCounter(
  options: UseLoadingCounterOptions = {}
): UseLoadingCounterReturn {
  const {
    duration = LOADER_CONFIG.counterDuration,
    onComplete,
    startDelay = 0,
  } = options;

  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const counterRef = useRef({ value: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref up to date
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const reset = useCallback(() => {
    if (tweenRef.current) {
      tweenRef.current.kill();
    }
    counterRef.current.value = 0;
    setCount(0);
    setIsComplete(false);
  }, []);

  // Start animation on mount only
  useEffect(() => {
    // Kill any existing animation
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    // Reset state
    counterRef.current.value = 0;
    setCount(0);
    setIsComplete(false);

    // Start GSAP tween
    tweenRef.current = gsap.to(counterRef.current, {
      value: 100,
      duration,
      ease: LOADER_CONFIG.counterEase,
      delay: startDelay,
      onUpdate: () => {
        setCount(Math.round(counterRef.current.value));
      },
      onComplete: () => {
        setCount(100);
        setIsComplete(true);
        onCompleteRef.current?.();
      },
    });

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, [duration, startDelay]);

  return { count, isComplete, reset };
}