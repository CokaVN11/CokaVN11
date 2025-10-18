'use client';

import { useState } from 'react';
import { PokemonPanel } from './pokemon-panel';
import { ThemeToggle } from './theme-toggle';
import { PokemonHeading, PokemonText, PokemonLabel } from './text';
import { motion } from 'framer-motion';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SettingsPanel component with accessibility and animation options
 *
 * This component provides a comprehensive settings interface
 * for theme and accessibility preferences.
 */
export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <PokemonPanel isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6">
        {/* Theme Settings */}
        <div>
          <PokemonLabel>Theme Selection</PokemonLabel>
          <PokemonText className="mb-4 text-sm">Choose your Pokemon adventure style</PokemonText>
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </div>

        {/* Animation Settings */}
        <div>
          <PokemonLabel>Animations</PokemonLabel>
          <PokemonText className="mb-4 text-sm">Toggle visual effects and transitions</PokemonText>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg border-2 border-[var(--color-ink)] hover:bg-[var(--color-cta)/20] transition-colors">
              <span className="font-body font-medium">Enable Animations</span>
              <input
                type="checkbox"
                checked={animationsEnabled}
                onChange={(e) => setAnimationsEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border-2 border-[var(--color-ink)] hover:bg-[var(--color-cta)/20] transition-colors">
              <span className="font-body font-medium">Reduced Motion</span>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </label>
          </div>
        </div>

        {/* Accessibility */}
        <div>
          <PokemonLabel>Accessibility</PokemonLabel>
          <PokemonText className="mb-4 text-sm">Customize your viewing experience</PokemonText>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg border-2 border-[var(--color-ink)] hover:bg-[var(--color-cta)/20] transition-colors">
              <span className="font-body font-medium">High Contrast Mode</span>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </label>
          </div>
        </div>

        {/* Theme Info */}
        <div className="pt-4 border-t-2 border-[var(--color-ink)]">
          <PokemonHeading className="text-lg mb-2">About Themes</PokemonHeading>
          <PokemonText className="text-sm leading-relaxed">
            Pokemon FireRed and LeafGreen themes bring the classic Game Boy Advance aesthetic to
            your portfolio. Each theme features authentic color palettes, GBA-style shadows, and
            Pokemon-inspired typography.
          </PokemonText>
        </div>

        {/* Reset Button */}
        <div className="pt-4">
          <motion.button
            onClick={() => {
              setAnimationsEnabled(true);
              setHighContrast(false);
              setReducedMotion(false);
            }}
            className="w-full pokemon-button py-2 px-4 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset to Defaults
          </motion.button>
        </div>
      </div>
    </PokemonPanel>
  );
}
