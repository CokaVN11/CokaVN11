'use client';

import { motion } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
  className?: string;
}

/**
 * PokemonHeading component with pixel font styling
 *
 * This component provides authentic Pokemon game-style headers
 * with the VT323 pixel font and proper spacing.
 */
export const PokemonHeading = forwardRef<HTMLHeadingElement, TextProps>(
  ({ children, className = '' }, ref) => {
    return (
      <motion.h1
        ref={ref}
        className={`
          font-pixel text-2xl md:text-3xl font-bold
          uppercase tracking-wider
          text-[var(--color-ink)]
          leading-tight
          ${className}
        `}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          textShadow: '2px 2px 0px color-mix(in srgb, var(--color-ink) 20%, transparent)',
        }}
      >
        {children}
      </motion.h1>
    );
  }
);

PokemonHeading.displayName = 'PokemonHeading';

/**
 * PokemonSubheading component with pixel font styling
 *
 * This component provides Pokemon game-style subheadings
 * with proper visual hierarchy.
 */
export const PokemonSubheading = forwardRef<HTMLHeadingElement, TextProps>(
  ({ children, className = '' }, ref) => {
    return (
      <motion.h2
        ref={ref}
        className={`
          font-pixel text-xl md:text-2xl font-bold
          uppercase tracking-wider
          text-[var(--color-primary)]
          leading-tight
          ${className}
        `}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.25,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          textShadow: '1px 1px 0px color-mix(in srgb, var(--color-primary) 15%, transparent)',
        }}
      >
        {children}
      </motion.h2>
    );
  }
);

PokemonSubheading.displayName = 'PokemonSubheading';

/**
 * PokemonText component for body text with theme-aware coloring
 *
 * This component provides themed body text that adapts
 * to the current Pokemon theme.
 */
export const PokemonText = forwardRef<HTMLParagraphElement, TextProps>(
  ({ children, className = '' }, ref) => {
    return (
      <motion.p
        ref={ref}
        className={`
          font-body text-base md:text-lg
          text-[var(--color-ink)]
          leading-relaxed
          ${className}
        `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.p>
    );
  }
);

PokemonText.displayName = 'PokemonText';

/**
 * PokemonLabel component for form labels and UI elements
 *
 * This component provides styled labels with Pokemon theming.
 */
export const PokemonLabel = forwardRef<HTMLLabelElement, TextProps>(
  ({ children, className = '' }, ref) => {
    return (
      <motion.label
        ref={ref}
        className={`
          font-pixel text-sm font-bold
          uppercase tracking-wide
          text-[var(--color-secondary)]
          block mb-2
          ${className}
        `}
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.label>
    );
  }
);

PokemonLabel.displayName = 'PokemonLabel';
