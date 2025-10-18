'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Position, Direction } from '@/types/gameboy';

interface AdventurerProps {
  position: Position;
  facing: Direction;
  isMoving: boolean;
  size?: number;
  className?: string;
}

export function Adventurer({
  position,
  facing,
  isMoving,
  size = 32,
  className = '',
}: AdventurerProps) {
  // Get the appropriate character sprite based on facing direction
  const getCharacterSprite = (direction: Direction): string => {
    switch (direction) {
      case 'up':
        return '🚶‍♂️';
      case 'down':
        return '🚶';
      case 'left':
        return '🚶‍♀️←';
      case 'right':
        return '🚶→';
      default:
        return '🚶';
    }
  };

  // Animation variants for character movement
  const movementVariants = {
    idle: {
      scale: 1,
      rotate: 0,
    },
    walking: {
      scale: [1, 1.1, 1],
      rotate: [-2, 2, -2],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    jumping: {
      y: [0, -4, 0],
      scale: [1, 0.95, 1],
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
  };

  // Determine current animation state
  const animationState = isMoving ? 'walking' : 'idle';

  return (
    <motion.div
      className={`adventurer ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.7}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        pointerEvents: 'none',
        filter: 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.3))',
      }}
      variants={movementVariants}
      animate={animationState}
      initial={false}
      aria-label={`Adventurer character facing ${facing}`}
      role="img"
    >
      <motion.span
        style={{
          display: 'inline-block',
          transform: `rotate(${getRotationForDirection(facing)}deg)`,
        }}
        animate={{
          rotate: getRotationForDirection(facing),
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
      >
        {getCharacterSprite(facing)}
      </motion.span>
    </motion.div>
  );
}

// Helper function to determine rotation based on facing direction
function getRotationForDirection(direction: Direction): number {
  switch (direction) {
    case 'up':
      return -90;
    case 'right':
      return 0;
    case 'down':
      return 90;
    case 'left':
      return 180;
    default:
      return 0;
  }
}

export default Adventurer;
