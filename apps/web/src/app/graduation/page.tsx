// ABOUTME: Awwwards-style dark agency graduation invitation with WebGL hero
// ABOUTME: Custom cursor, loading screen, split layout (58%/42%), marquee footer

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
import { useReducedMotion } from './hooks/useReducedMotion';

export default function GraduationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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
      {!shouldReduceMotion && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to main content
      </a>

      {/* Background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0 grid-lines-bg"
        aria-hidden="true"
      />

      {/* Main content */}
      <main
        id="main-content"
        className="relative z-[1] flex h-screen w-full flex-col md:flex-row"
        style={{
          opacity: showContent ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Left Panel: Hero Canvas (58% desktop, 45vh mobile) */}
        <section
          className="relative h-[45vh] flex-shrink-0 md:h-full md:w-[58%]"
          aria-label="Hero visual"
        >
          <HeroCanvas
            imageUrl="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop&q=80"
          />
          <FloatingName isRevealed={triggerReveal} />
        </section>

        {/* Right Panel: Info Content (42% desktop, remaining height mobile) */}
        <section
          className="flex flex-1 flex-col justify-center overflow-y-auto bg-grad-single-bg-dark-alt px-6 py-8 scrollbar-grad-single md:w-[42%] md:px-12 md:py-12 lg:px-16"
          aria-label="Event information"
        >
          <div className="flex max-w-lg flex-col gap-8">
            {/* Info Grid */}
            <InfoGrid isRevealed={triggerReveal} />

            {/* CTA Buttons */}
            <CTASection isRevealed={triggerReveal} />

            {/* Parking Note */}
            <div
              className="reveal-parking"
              style={{
                opacity: shouldReduceMotion || isRevealed ? 1 : 0,
                transform: shouldReduceMotion || isRevealed ? 'none' : 'translateY(20px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
                transitionDelay: '0.8s',
              }}
            >
              <ParkingNote />
            </div>
          </div>
        </section>
      </main>

      {/* Marquee Footer */}
      <MarqueeFooter isRevealed={triggerReveal} />
    </div>
  );
}
