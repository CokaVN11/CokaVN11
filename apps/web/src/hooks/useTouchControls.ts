/**
 * GameBoy Portfolio UI - Touch Controls Hook (Web)
 *
 * Touch event handling for web applications with custom D-pad overlay
 * Compatible with keyboard controls for unified input handling
 */

import { useEffect, useRef, useState } from 'react';
import type { Direction, Position } from '../types/gameboy';
import { useGameState } from './useGameState';

// Web touch event handler types
export type WebTouchEventHandler = (event: TouchEvent) => void;

// D-pad button configuration
export interface DPadButton {
  id: string;
  label: string;
  position: 'left' | 'right' | 'top' | 'bottom' | 'center';
  action: () => void;
  className?: string;
}

// Default D-pad configuration
const DEFAULT_DPAD: DPadButton[] = [
  {
    id: 'dpad-up',
    label: '↑',
    position: 'top',
    action: () => useGameState.getState().setAdventurerFacing('up'),
  },
  {
    id: 'dpad-down',
    label: '↓',
    position: 'bottom',
    action: () => useGameState.getState().setAdventurerFacing('down'),
  },
  {
    id: 'dpad-left',
    label: '←',
    position: 'left',
    action: () => useGameState.getState().setAdventurerFacing('left'),
  },
  {
    id: 'dpad-right',
    label: '→',
    position: 'right',
    action: () => useGameState.getState().setAdventurerFacing('right'),
  },
  {
    id: 'dpad-interact',
    label: 'A',
    position: 'center',
    action: () => useGameState.getState().updateNodeInteraction(''),
  },
];

// Touch controls hook
export const useTouchControls = (config: DPadButton[] = DEFAULT_DPAD) => {
  const [dpadConfig, setDPadConfig] = useState<DPadButton[]>(config);
  const [touchStart, setTouchStart] = useState<{
    clientX: number;
    clientY: number;
    timestamp: number;
  } | null>(null);

  /**
   * Handle web touch events
   */
  const handleWebTouchStart: WebTouchEventHandler = (event) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      setTouchStart({
        clientX: touch.clientX,
        clientY: touch.clientY,
        timestamp: Date.now(),
      });
    }
  };

  const handleWebTouchMove: WebTouchEventHandler = (event) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const currentTouch = touchStart;

      if (currentTouch) {
        const deltaX = touch.clientX - currentTouch.clientX;
        const deltaY = touch.clientY - currentTouch.clientY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Process swipe gestures
        if (distance > 30) {
          const angle = Math.atan2(deltaY, deltaX);
          let swipeDirection: Direction | null;

          const degrees = angle * (180 / Math.PI);
          if (degrees >= -45 && degrees < 45) swipeDirection = 'right';
          else if (degrees <= -45 || degrees >= 135) swipeDirection = 'left';
          else if (degrees >= 45 && degrees < 135) swipeDirection = 'down';
          else swipeDirection = 'up';

          // Trigger character movement
          if (swipeDirection) {
            useGameState.getState().setAdventurerPosition({
              x: Math.max(0, Math.min(15, currentTouch.clientX + 50)),
              y: Math.max(0, Math.min(15, currentTouch.clientY + 50)),
            });
          }
        }
      }

      setTouchStart(null);
    }
  };

  const handleWebTouchEnd: WebTouchEventHandler = (event) => {
    // Process tap events
    const currentTouch = touchStart;
    if (currentTouch) {
      const duration = Date.now() - currentTouch.timestamp;
      const deltaX = Math.abs(currentTouch.clientX - currentTouch.clientX);
      const deltaY = Math.abs(currentTouch.clientY - currentTouch.clientY);

      // Detect tap vs swipe
      if (duration < 150 && deltaX < 10 && deltaY < 10) {
        // Tap detected - trigger interaction
        useGameState.getState().updateNodeInteraction('');
      }

      setTouchStart(null);
    }
  };

  /**
   * D-pad button handlers
   */
  const handleDPadPress = (button: DPadButton): void => {
    button.action();
    // Trigger haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  /**
   * Update D-pad configuration
   */
  const updateDPadConfig = (newConfig: DPadButton[]): void => {
    setDPadConfig(newConfig);
  };

  /**
   * Register touch event handlers
   */
  const registerWebTouchHandler = (type: string): WebTouchEventHandler | undefined => {
    switch (type) {
      case 'touchstart':
        return handleWebTouchStart;
      case 'touchmove':
        return handleWebTouchMove;
      case 'touchend':
        return handleWebTouchEnd;
      default:
        return undefined;
    }
  };

  /**
   * Prevent default touch behavior
   */
  const preventWebDefaultBehavior = (): void => {
    // Prevent page scrolling and zooming
    document.addEventListener(
      'touchmove',
      (event) => {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      },
      { passive: false }
    );

    document.addEventListener('touchstart', (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    });
  };

  return {
    updateDPadConfig,
    registerWebTouchHandler,
    dpadConfig,
    handleDPadPress,
    preventWebDefaultBehavior,
  };
};
