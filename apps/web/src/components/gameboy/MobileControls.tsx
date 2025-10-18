'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStateActions } from '@/hooks/useGameState';

interface MobileControlsProps {
  className?: string;
  onMove?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onInteract?: () => void;
  disabled?: boolean;
}

export function MobileControls({
  className = '',
  onMove,
  onInteract,
  disabled = false,
}: MobileControlsProps) {
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const { gameState } = useGameStateActions();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const controlsRef = useRef<HTMLDivElement>(null);

  // Check if touch controls should be shown
  const shouldShowControls = isMobile && gameState.settings.animationsEnabled && !disabled;

  // Handle touch start for D-pad
  const handleDirectionStart = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (disabled) return;

      setActiveDirection(direction);
      onMove?.(direction);

      // Add haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    },
    [onMove, disabled]
  );

  // Handle touch end for D-pad
  const handleDirectionEnd = useCallback(() => {
    setActiveDirection(null);
  }, []);

  // Handle action button press
  const handleActionStart = useCallback(() => {
    if (disabled) return;

    setActiveButton('action');
    onInteract?.();

    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  }, [onInteract, disabled]);

  // Handle action button release
  const handleActionEnd = useCallback(() => {
    setActiveButton(null);
  }, []);

  // Prevent default touch behaviors
  const preventDefault = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
  }, []);

  // Don't render on desktop or if disabled
  if (!shouldShowControls) {
    return null;
  }

  return (
    <motion.div
      ref={controlsRef}
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ touchAction: 'none' }}
    >
      <div className="relative flex flex-col items-center gap-4 p-4 pokemon-card gba-shadow font-pixel">
        {/* D-pad controls */}
        <div className="relative w-32 h-32">
          {/* Up button */}
          <button
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-lg border-2 transition-all duration-150 flex items-center justify-center text-white font-bold pokemon-button gba-shadow-sm ${
              activeDirection === 'up'
                ? 'gba-shadow scale-95'
                : 'hover:scale-105'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onTouchStart={(e) => {
              preventDefault(e);
              handleDirectionStart('up');
            }}
            onTouchEnd={(e) => {
              preventDefault(e);
              handleDirectionEnd();
            }}
            onMouseDown={() => handleDirectionStart('up')}
            onMouseUp={handleDirectionEnd}
            onMouseLeave={handleDirectionEnd}
            disabled={disabled}
            aria-label="Move up"
          >
            ↑
          </button>

          {/* Left button */}
          <button
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-lg border-2 transition-all duration-150 flex items-center justify-center text-white font-bold pokemon-button gba-shadow-sm ${
              activeDirection === 'left'
                ? 'gba-shadow scale-95'
                : 'hover:scale-105'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onTouchStart={(e) => {
              preventDefault(e);
              handleDirectionStart('left');
            }}
            onTouchEnd={(e) => {
              preventDefault(e);
              handleDirectionEnd();
            }}
            onMouseDown={() => handleDirectionStart('left')}
            onMouseUp={handleDirectionEnd}
            onMouseLeave={handleDirectionEnd}
            disabled={disabled}
            aria-label="Move left"
          >
            ←
          </button>

          {/* Right button */}
          <button
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-lg border-2 transition-all duration-150 flex items-center justify-center text-white font-bold pokemon-button gba-shadow-sm ${
              activeDirection === 'right'
                ? 'gba-shadow scale-95'
                : 'hover:scale-105'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onTouchStart={(e) => {
              preventDefault(e);
              handleDirectionStart('right');
            }}
            onTouchEnd={(e) => {
              preventDefault(e);
              handleDirectionEnd();
            }}
            onMouseDown={() => handleDirectionStart('right')}
            onMouseUp={handleDirectionEnd}
            onMouseLeave={handleDirectionEnd}
            disabled={disabled}
            aria-label="Move right"
          >
            →
          </button>

          {/* Down button */}
          <button
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-lg border-2 transition-all duration-150 flex items-center justify-center text-white font-bold pokemon-button gba-shadow-sm ${
              activeDirection === 'down'
                ? 'gba-shadow scale-95'
                : 'hover:scale-105'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onTouchStart={(e) => {
              preventDefault(e);
              handleDirectionStart('down');
            }}
            onTouchEnd={(e) => {
              preventDefault(e);
              handleDirectionEnd();
            }}
            onMouseDown={() => handleDirectionStart('down')}
            onMouseUp={handleDirectionEnd}
            onMouseLeave={handleDirectionEnd}
            disabled={disabled}
            aria-label="Move down"
          >
            ↓
          </button>

          {/* Center D-pad indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full gba-shadow-sm" />
        </div>

        {/* Action button */}
        <button
          className={`w-16 h-16 rounded-full border-2 transition-all duration-150 flex items-center justify-center text-white font-bold text-lg pokemon-button gba-shadow ${
            activeButton === 'action'
              ? 'gba-shadow scale-95'
              : 'hover:scale-105'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onTouchStart={(e) => {
            preventDefault(e);
            handleActionStart();
          }}
          onTouchEnd={(e) => {
            preventDefault(e);
            handleActionEnd();
          }}
          onMouseDown={handleActionStart}
          onMouseUp={handleActionEnd}
          onMouseLeave={handleActionEnd}
          disabled={disabled}
          aria-label="Interact"
        >
          A
        </button>

        {/* Instructions */}
        <div className="text-xs text-center opacity-70 font-pixel">Use D-pad to move, A to interact</div>
      </div>
    </motion.div>
  );
}

export default MobileControls;