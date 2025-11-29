// ABOUTME: Awwwards-style graduation invitation with aurora gradient hero
// ABOUTME: Custom cursor, loading screen, split layout (35%/65%), i18n support

'use client';

import { useState, useCallback } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { LoadingScreen } from './components/LoadingScreen';
import { HeroCanvas } from './components/HeroCanvas';
import { FloatingName } from './components/FloatingName';
import { InfoGrid } from './components/InfoGrid';
import { CTASection } from './components/CTASection';
import { ParkingNote } from './components/ParkingNote';
import { MarqueeFooter } from './components/MarqueeFooter';
import { FloatingChickens } from './components/FloatingChickens';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useLocale } from './hooks/useLocale';

export default function GraduationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLocale();

  // Handle loading complete
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    // Trigger reveal animations after a short delay
    setTimeout(() => {
      setIsRevealed(true);
    }, 100);
  }, []);

  // Skip loading for reduced motion
  const showContent = shouldReduceMotion || !isLoading;
  const triggerReveal = shouldReduceMotion || isRevealed;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-grad-single-bg-dark font-body text-grad-single-text cursor-none-graduation">
      {/* Custom cursor */}
      <CustomCursor enabled={!isLoading} />

      {/* Loading screen */}
      {!shouldReduceMotion && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Floating chickens celebration */}
      {showContent && <FloatingChickens />}

      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        {t.skipToMainContent}
      </a>

      {/* Background grid pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 grid-lines-bg" aria-hidden="true" />

      {/* Main content */}
      <main
        id="main-content"
        className="relative z-[1] flex h-screen w-full flex-col md:flex-row"
        style={{
          opacity: showContent ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Left Panel: Hero Canvas (35% desktop, hidden on mobile) */}
        <section
          className="hidden md:relative md:block md:h-full md:w-[35%]"
          aria-label={t.heroVisual}
        >
          <HeroCanvas />
          <FloatingName isRevealed={triggerReveal} />
        </section>

        {/* Right Panel: Info Content (65% desktop, full screen mobile) */}
        <section
          className="relative flex h-full w-full flex-col justify-center overflow-y-auto bg-grad-single-bg-dark-alt px-6 py-8 scrollbar-grad-single md:h-auto md:w-[65%] md:px-12 md:py-12 lg:px-16"
          aria-label={t.eventInformation}
        >
          {/* Aurora gradient - enhanced for mobile (no hero to bleed from) */}
          <div
            className="pointer-events-none absolute inset-0 z-0 md:hidden"
            style={{
              background: `
                radial-gradient(ellipse at top left, rgba(115, 38, 166, 0.12) 0%, transparent 50%),
                radial-gradient(ellipse at bottom right, rgba(217, 64, 140, 0.08) 0%, transparent 50%)
              `,
            }}
            aria-hidden="true"
          />
          {/* Aurora gradient bleed from hero canvas (desktop only) */}
          <div
            className="pointer-events-none absolute inset-0 z-0 hidden md:block"
            style={{
              background:
                'linear-gradient(90deg, rgba(115, 38, 166, 0.08) 0%, rgba(217, 64, 140, 0.04) 20%, transparent 50%)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-[1] flex w-full flex-col gap-8">
            {/* Info Grid */}
            <InfoGrid isRevealed={triggerReveal} />

            {/* CTA Buttons */}
            <CTASection isRevealed={triggerReveal} />

            {/* Parking Note */}
            <ParkingNote isRevealed={triggerReveal} />
          </div>
          {/* End content wrapper */}
        </section>
      </main>

      {/* Marquee Footer */}
      <MarqueeFooter isRevealed={triggerReveal} />
    </div>
  );
}
