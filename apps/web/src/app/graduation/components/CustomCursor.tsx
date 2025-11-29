// ABOUTME: Custom cursor component with dot and ring following mouse
// ABOUTME: Features mix-blend-mode difference for visibility on any background

'use client';

import { useCustomCursor } from '../hooks/useCustomCursor';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { CURSOR_CONFIG } from '../config/animations';

interface CustomCursorProps {
  /** Override cursor visibility */
  enabled?: boolean;
}

/**
 * Custom cursor with inner dot and outer ring
 * - Inner dot follows mouse instantly
 * - Outer ring follows with smooth lerping
 * - Scales on hover and click
 * - Uses mix-blend-mode: difference for visibility
 */
export function CustomCursor({ enabled = true }: CustomCursorProps) {
  const shouldReduceMotion = useReducedMotion();
  const { mousePos, ringPos, isHovering, isClicking, isVisible, isTouchDevice } = useCustomCursor(
    enabled && !shouldReduceMotion
  );

  // Don't render on touch devices or if disabled
  if (isTouchDevice || !enabled) {
    return null;
  }

  // Calculate ring size based on state
  const getRingSize = () => {
    if (isClicking) return CURSOR_CONFIG.ringClickSize;
    if (isHovering) return CURSOR_CONFIG.ringHoverSize;
    return CURSOR_CONFIG.ringSize;
  };

  const ringSize = getRingSize();

  return (
    <>
      {/* Inner dot - follows mouse instantly */}
      <div
        className="pointer-events-none fixed z-[9999] rounded-full bg-white"
        style={{
          width: CURSOR_CONFIG.dotSize,
          height: CURSOR_CONFIG.dotSize,
          left: mousePos.x - CURSOR_CONFIG.dotSize / 2,
          top: mousePos.y - CURSOR_CONFIG.dotSize / 2,
          mixBlendMode: CURSOR_CONFIG.mixBlendMode,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
        aria-hidden="true"
      />

      {/* Outer ring - follows with smooth lerp */}
      <div
        className="pointer-events-none fixed z-[9998] rounded-full border-2 border-white"
        style={{
          width: ringSize,
          height: ringSize,
          left: ringPos.x - ringSize / 2,
          top: ringPos.y - ringSize / 2,
          mixBlendMode: CURSOR_CONFIG.mixBlendMode,
          opacity: isVisible ? 1 : 0,
          transition: shouldReduceMotion
            ? 'none'
            : 'width 0.2s ease, height 0.2s ease, opacity 0.2s ease',
        }}
        aria-hidden="true"
      />
    </>
  );
}
