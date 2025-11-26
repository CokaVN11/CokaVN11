// ABOUTME: Custom hook for tracking mouse position with smooth lerping
// ABOUTME: Handles hover states for interactive elements and respects reduced motion

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CURSOR_CONFIG } from '../config/animations';

interface CursorPosition {
  x: number;
  y: number;
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
}

/**
 * Custom cursor hook with smooth lerping and hover detection
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

  const rafRef = useRef<number | null>(null);
  const targetPosRef = useRef<CursorPosition>({ x: 0, y: 0 });
  const currentPosRef = useRef<CursorPosition>({ x: 0, y: 0 });

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

  // RAF loop for smooth ring following
  useEffect(() => {
    if (!enabled || isTouchDevice) return;

    const animate = () => {
      currentPosRef.current = {
        x: lerp(currentPosRef.current.x, targetPosRef.current.x, CURSOR_CONFIG.ringSmoothing),
        y: lerp(currentPosRef.current.y, targetPosRef.current.y, CURSOR_CONFIG.ringSmoothing),
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

  // Mouse move handler
  useEffect(() => {
    if (!enabled || isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      targetPosRef.current = newPos;
      setMousePos(newPos);
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
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
        target.closest('[data-cursor-hover]') !== null;

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
  };
}
