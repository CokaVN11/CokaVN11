// ABOUTME: Custom hook for tracking mouse position with smooth lerping and magnetic effect
// ABOUTME: Handles hover states, magnetic snapping, and respects reduced motion

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CURSOR_CONFIG } from '../config/animations';

interface CursorPosition {
  x: number;
  y: number;
}

interface MagnetTarget {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CursorState {
  /** Immediate mouse position (for inner dot) */
  mousePos: CursorPosition;
  /** Lerped position (for outer ring) */
  ringPos: CursorPosition;
  /** Whether cursor is hovering an interactive element */
  isHovering: boolean;
  /** Whether mouse button is pressed */
  isClicking: boolean;
  /** Whether cursor should be visible */
  isVisible: boolean;
  /** Whether device supports touch (hide cursor) */
  isTouchDevice: boolean;
  /** Whether cursor is magnetically attracted to an element */
  isMagnetic: boolean;
}

/** Magnetic effect configuration */
const MAGNETIC_CONFIG = {
  /** Distance threshold to activate magnetic effect (pixels) */
  radius: 100,
  /** Strength of magnetic pull (0-1, higher = stronger pull) */
  strength: 0.35,
};

/**
 * Custom cursor hook with smooth lerping, hover detection, and magnetic effect
 *
 * Features:
 * - Smooth lerp-based ring following
 * - Pauses RAF when cursor leaves viewport (performance)
 * - Magnetic effect for elements with [data-cursor-magnetic]
 *
 * @param enabled - Whether cursor tracking is enabled
 * @returns CursorState with positions and interaction states
 */
export function useCustomCursor(enabled: boolean = true): CursorState {
  const [mousePos, setMousePos] = useState<CursorPosition>({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMagnetic, setIsMagnetic] = useState(false);

  const rafRef = useRef<number | null>(null);
  const targetPosRef = useRef<CursorPosition>({ x: 0, y: 0 });
  const currentPosRef = useRef<CursorPosition>({ x: 0, y: 0 });
  const isVisibleRef = useRef(false);
  const magnetTargetRef = useRef<MagnetTarget | null>(null);

  // Keep isVisibleRef in sync with isVisible state
  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  // Detect touch device
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch && CURSOR_CONFIG.hideOnTouch);
  }, []);

  // Linear interpolation helper
  const lerp = useCallback((start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  }, []);

  // RAF loop for smooth ring following (pauses when not visible)
  useEffect(() => {
    if (!enabled || isTouchDevice) return;

    const animate = () => {
      // Skip calculations when cursor is not visible (performance optimization)
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Calculate target position with magnetic effect
      let targetX = targetPosRef.current.x;
      let targetY = targetPosRef.current.y;

      if (magnetTargetRef.current) {
        const magnet = magnetTargetRef.current;
        const magnetCenterX = magnet.x + magnet.width / 2;
        const magnetCenterY = magnet.y + magnet.height / 2;

        // Blend toward magnet center
        targetX = lerp(targetX, magnetCenterX, MAGNETIC_CONFIG.strength);
        targetY = lerp(targetY, magnetCenterY, MAGNETIC_CONFIG.strength);
      }

      currentPosRef.current = {
        x: lerp(currentPosRef.current.x, targetX, CURSOR_CONFIG.ringSmoothing),
        y: lerp(currentPosRef.current.y, targetY, CURSOR_CONFIG.ringSmoothing),
      };

      setRingPos({ ...currentPosRef.current });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, isTouchDevice, lerp]);

  // Mouse move handler with magnetic detection
  useEffect(() => {
    if (!enabled || isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      targetPosRef.current = newPos;
      setMousePos(newPos);
      setIsVisible(true);

      // Check for magnetic elements
      const target = e.target as HTMLElement;
      const magneticEl = target.closest('[data-cursor-magnetic]') as HTMLElement | null;

      if (magneticEl) {
        const rect = magneticEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );

        if (distance < MAGNETIC_CONFIG.radius) {
          magnetTargetRef.current = {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          };
          setIsMagnetic(true);
        } else {
          magnetTargetRef.current = null;
          setIsMagnetic(false);
        }
      } else {
        magnetTargetRef.current = null;
        setIsMagnetic(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      magnetTargetRef.current = null;
      setIsMagnetic(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [enabled, isTouchDevice]);

  // Click handlers
  useEffect(() => {
    if (!enabled || isTouchDevice) return;

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [enabled, isTouchDevice]);

  // Hover detection for interactive elements
  useEffect(() => {
    if (!enabled || isTouchDevice) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.hasAttribute('data-cursor-hover') ||
        target.closest('[data-cursor-hover]') !== null ||
        target.hasAttribute('data-cursor-magnetic') ||
        target.closest('[data-cursor-magnetic]') !== null;

      setIsHovering(isInteractive);
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [enabled, isTouchDevice]);

  return {
    mousePos,
    ringPos,
    isHovering,
    isClicking,
    isVisible,
    isTouchDevice,
    isMagnetic,
  };
}
