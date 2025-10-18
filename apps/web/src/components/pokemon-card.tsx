'use client';

import { motion } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';

interface PokemonCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * PokemonCard component with GBA-style depth effects and hover states
 *
 * This component mimics the look and feel of Pokemon FireRed/LeafGreen
 * interactive elements with proper depth, shadows, and transitions.
 */
export const PokemonCard = forwardRef<HTMLDivElement, PokemonCardProps>(
  ({ children, className = '', onClick }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{
          scale: 1.02,
          y: -2,
        }}
        whileTap={{
          scale: 0.98,
          y: 1,
        }}
        className={`
          pokemon-card
          relative overflow-hidden
          cursor-pointer
          p-6
          gba-shadow
          hover:gba-shadow-lg
          transition-all duration-200 ease-out
          ${className}
        `}
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="relative z-10">{children}</div>

        {/* Pokemon-style top border with gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />

        {/* Subtle inner shadow for depth */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[color-mix(in srgb, var(--color-ink) 5%, transparent)] opacity-30" />
        </div>
      </motion.div>
    );
  }
);

PokemonCard.displayName = 'PokemonCard';
