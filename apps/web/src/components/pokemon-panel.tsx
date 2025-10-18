'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect } from 'react';

interface PokemonPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

/**
 * PokemonPanel component with slide-in animations and GBA styling
 *
 * This component creates a slide-in panel that mimics Pokemon game menus
 * with authentic animations and styling.
 */
export function PokemonPanel({ isOpen, onClose, children, title }: PokemonPanelProps) {
  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
            style={{
              backgroundColor: 'color-mix(in srgb, rgba(0,0,0,0.5) 80%, var(--color-ink) 20%)',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1], // Expo out easing
            }}
            className={`
              fixed top-0 right-0 h-full w-80
              bg-gradient-to-b from-white to-gray-50
              border-l-4 border-[var(--color-ink)]
              gba-shadow-lg
              z-50
              overflow-hidden
            `}
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-background) 95%, white 5%)',
              borderLeftColor: 'var(--color-ink)',
            }}
          >
            {/* Panel Header */}
            <div
              className="sticky top-0 p-4 border-b-2"
              style={{
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                borderColor: 'var(--color-ink)',
              }}
            >
              <div className="flex items-center justify-between">
                {title && (
                  <h2 className="font-pixel text-xl font-bold uppercase tracking-wider text-white">
                    {title}
                  </h2>
                )}
                <button
                  onClick={onClose}
                  className="
                    p-2 rounded hover:bg-white/20 transition-colors
                    text-white font-bold text-lg
                    hover:scale-110 active:scale-95
                    transition-transform duration-150
                  "
                  aria-label="Close panel"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="p-4 overflow-y-auto h-full pb-20">{children}</div>

            {/* Pokemon-style decorative element */}
            <div
              className="absolute bottom-0 left-0 right-0 h-2"
              style={{
                background: 'linear-gradient(90deg, var(--color-secondary), var(--color-primary))',
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
