'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * ThemeToggle component for switching between FireRed and LeafGreen themes
 *
 * This component provides a Pokemon-styled button for theme switching
 * with proper accessibility and animations.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme as 'fire' | 'leaf';
  const nextTheme = currentTheme === 'fire' ? 'leaf' : 'fire';

  const themeConfig = {
    fire: {
      icon: '🔥',
      label: 'FireRed',
      color: '#E23C2A',
    },
    leaf: {
      icon: '🍃',
      label: 'LeafGreen',
      color: '#4CAF50',
    },
  };

  const current = themeConfig[currentTheme];
  const next = themeConfig[nextTheme];

  return (
    <motion.button
      onClick={() => setTheme(nextTheme)}
      className={`
        pokemon-button
        flex items-center gap-2 px-4 py-2
        font-bold text-sm
        gba-shadow hover:gba-shadow-lg
        transition-all duration-150
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
      `}
      style={
        {
          '--tw-ring-color': current.color,
        } as React.CSSProperties
      }
      aria-label={`Switch to ${next.label} theme`}
      title={`Currently: ${current.label}. Click to switch to ${next.label}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.span
        key={currentTheme}
        className="text-lg"
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {current.icon}
      </motion.span>

      <span className="font-pixel uppercase tracking-wider text-xs">{current.label}</span>

      {/* Pokemon-style indicator */}
      <motion.div
        className="w-2 h-2 rounded-full ml-1"
        style={{ backgroundColor: current.color }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
}
