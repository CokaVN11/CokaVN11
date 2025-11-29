// ABOUTME: Hook for managing hero canvas state including mouse tracking and texture loading
// ABOUTME: Provides normalized mouse position and handles resize events

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface CanvasSize {
  width: number;
  height: number;
}

interface UseHeroCanvasReturn {
  /** Normalized mouse position (0-1) */
  mousePosition: { x: number; y: number };
  /** Canvas container size */
  canvasSize: CanvasSize;
  /** Reference to attach to container */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Whether texture is loaded */
  isTextureLoaded: boolean;
  /** Set texture loaded state */
  setTextureLoaded: (loaded: boolean) => void;
}

/**
 * Hook for hero canvas management
 *
 * - Tracks normalized mouse position within container
 * - Handles resize events
 * - Manages texture loading state
 */
export function useHeroCanvas(): UseHeroCanvasReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width: 0, height: 0 });
  const [isTextureLoaded, setTextureLoaded] = useState(false);

  // Handle mouse move within container
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Clamp to 0-1 range
    setMousePosition({
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, 1 - y)), // Flip Y for WebGL coordinates
    });
  }, []);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setCanvasSize({
      width: rect.width,
      height: rect.height,
    });
  }, []);

  // Setup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial size
    handleResize();

    // Event listeners
    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleMouseMove, handleResize]);

  return {
    mousePosition,
    canvasSize,
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    isTextureLoaded,
    setTextureLoaded,
  };
}
