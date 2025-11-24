// ABOUTME: Polaroid-style card component with tilt effect and animations
// ABOUTME: Used throughout the graduation invitation for photos and content cards

'use client';

import React from 'react';
import { motion } from 'motion/react';

interface PolaroidCardProps {
  children: React.ReactNode;
  caption?: string;
  tilt?: number;
  variant?: 'hero' | 'standard' | 'note';
  className?: string;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  children,
  caption,
  tilt = Math.random() * 4 - 2, // Random tilt between -2 and 2 degrees
  variant = 'standard',
  className = '',
}) => {
  const variantStyles = {
    hero: 'p-6 md:p-8',
    standard: 'p-4 md:p-5',
    note: 'p-4 bg-graduation-accent',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, rotate: tilt * 1.2 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className={`
        bg-graduation-card rounded-3xl shadow-lg
        ${variantStyles[variant]}
        ${className}
      `}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="relative">{children}</div>
      {caption && (
        <p className="text-graduation-text/70 text-sm mt-3 text-center font-display italic">
          {caption}
        </p>
      )}
    </motion.div>
  );
};
