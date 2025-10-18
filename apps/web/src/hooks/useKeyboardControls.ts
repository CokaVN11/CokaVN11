/**
 * GameBoy Portfolio UI - Keyboard Controls Hook
 *
 * Handles keyboard input for adventurer movement and game interactions
 * Supports arrow keys and WASD for accessibility
 * Maintains consistent key mapping and prevents default browser behavior
 */

import type { Direction, Position } from '../types/gameboy';
import { useEffect } from 'react';

// Interface for keyboard controls configuration
interface KeyboardControlsConfig {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onInteract: () => void;
}

// GameBoy keyboard controls hook
export const useKeyboardControls = ({ onMove, onInteract }: KeyboardControlsConfig) => {
  useEffect(() => {
    /**
     * Handle key press events
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      // Prevent default behavior for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(key)) {
        event.preventDefault();
      }

      // Movement keys
      switch (key) {
        case 'ArrowUp':
        case 'KeyW':
          onMove('up');
          break;
        case 'ArrowDown':
        case 'KeyS':
          onMove('down');
          break;
        case 'ArrowLeft':
        case 'KeyA':
          onMove('left');
          break;
        case 'ArrowRight':
        case 'KeyD':
          onMove('right');
          break;

        // Action keys
        case ' ':
        case 'Space':
        case 'Enter':
          onInteract();
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onMove, onInteract]);
};
