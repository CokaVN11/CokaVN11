'use client';

import { ThemeProvider } from 'next-themes';

/**
 * Theme provider wrapper for Pokemon FireRed/LeafGreen theme system
 *
 * This component provides the next-themes ThemeProvider with configuration
 * optimized for the GBA Theme Migration feature.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="fire"
      themes={['fire', 'leaf']}
      enableSystem={false}
      storageKey="pokemon-theme"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
