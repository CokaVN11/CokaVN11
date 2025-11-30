// ABOUTME: Personalized invitation quote with 3-column event info layout
// ABOUTME: Guest name loaded from CSV via URL token, falls back to grid-only if not found

'use client';

import { useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { eventConfig } from '@/data/graduation-event';
import { useLocale } from '../hooks/useLocale';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useGuestName } from '../hooks/useGuestName';
import { Highlighter } from '@/components/ui/highlighter';

interface InfoGridProps {
  /** Whether reveal animations should play */
  isRevealed?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Staggered reveal animation variants
 */
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

/**
 * Inner component that uses useSearchParams (requires Suspense)
 */
function InfoGridInner({ isRevealed = false, className = '' }: InfoGridProps) {
  const { event, venue } = eventConfig;
  const { t, dateFnsLocale, timezone } = useLocale();
  const shouldReduceMotion = useReducedMotion();
  const { guestName, isLoading } = useGuestName();

  // Parse date and convert to event timezone
  const eventDate = parseISO(event.dateISO);
  const zonedDate = toZonedTime(eventDate, timezone);

  // Extract date parts
  const dayNumber = format(zonedDate, 'd', { locale: dateFnsLocale });
  const monthName = format(zonedDate, 'MMMM', { locale: dateFnsLocale });
  const year = format(zonedDate, 'yyyy', { locale: dateFnsLocale });

  // Format time with range and morning indicator
  const formattedTime = event.endTime
    ? `${event.startTime} - ${event.endTime} ${t.morningIndicator}`
    : `${event.startTime} ${t.morningIndicator}`;

  // Show quote only if guest name is found
  const showQuote = !isLoading && guestName !== null;

  // Handle location click - opens Google Maps
  const handleLocationClick = useCallback(() => {
    const query = encodeURIComponent(`${venue.name} ${venue.addressLine}`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  }, [venue.name, venue.addressLine]);

  // Handle keyboard activation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleLocationClick();
      }
    },
    [handleLocationClick]
  );

  // Opacity-only variants for elements with rough-notation (avoids position calculation issues)
  const opacityOnlyVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    }),
  };

  // Animation wrapper component
  const AnimatedItem = ({
    children,
    index,
    className: itemClassName = '',
    useOpacityOnly = false,
  }: {
    children: React.ReactNode;
    index: number;
    className?: string;
    useOpacityOnly?: boolean;
  }) => {
    if (shouldReduceMotion) {
      return <div className={itemClassName}>{children}</div>;
    }

    return (
      <motion.div
        className={itemClassName}
        variants={useOpacityOnly ? opacityOnlyVariants : itemVariants}
        initial="hidden"
        animate={isRevealed ? 'visible' : 'hidden'}
        custom={index}
      >
        {children}
      </motion.div>
    );
  };

  // Calculate animation indices based on whether quote is shown
  const getIndex = (baseIndex: number) => (showQuote ? baseIndex + 3 : baseIndex);

  return (
    <div className={`flex flex-col items-center text-center gap-6 md:gap-8 ${className}`}>
      {/* Invitation Quote Section (conditional) */}
      {showQuote && (
        <>
          {/* Quote Line 1: "Thân mời [Guest Name]," - opacity only to fix Highlighter position */}
          <AnimatedItem index={0} className="flex flex-col items-center" useOpacityOnly>
            <span className="text-2xl font-medium font-display text-white/90 md:text-3xl">
              {t.invitationQuoteLine1.replace('{guestName}', '').trim()}{' '}
              <Highlighter action="highlight" color="#FF9800">
                {guestName}
              </Highlighter>
            </span>
          </AnimatedItem>

          {/* Quote Line 2: "đến buổi lễ tốt nghiệp." */}
          <AnimatedItem index={1}>
            <span className="text-xl font-display text-white/70 md:text-2xl">
              {t.invitationQuoteLine2}
            </span>
          </AnimatedItem>

          {/* Divider after quote */}
          <AnimatedItem index={2}>
            <div className="w-32 h-px bg-white/10 md:w-48" />
          </AnimatedItem>
        </>
      )}

      {/* 3-Column Grid: Date | Time | Location */}
      <div className="grid w-full max-w-2xl grid-cols-3 gap-4 md:gap-8">
        {/* Date Column */}
        <AnimatedItem
          index={getIndex(0)}
          className="flex flex-col items-center justify-center text-center "
        >
          <span className="text-3xl font-bold font-display text-white/90 md:text-4xl">
            {dayNumber}
          </span>
          <span className="text-sm font-medium tracking-wider uppercase text-white/70 md:text-base">
            {monthName}
          </span>
          <span className="text-xs text-white/50 md:text-sm">{year}</span>
        </AnimatedItem>

        {/* Time Column */}
        <AnimatedItem
          index={getIndex(1)}
          className="flex flex-col items-center justify-center text-center"
        >
          <span className="text-2xl font-medium font-display text-white/80 md:text-3xl">
            {formattedTime}
          </span>
        </AnimatedItem>

        {/* Location Column (clickable) */}
        <AnimatedItem index={getIndex(2)} className="flex items-center justify-center">
          <button
            data-cursor-magnetic
            onClick={handleLocationClick}
            onKeyDown={handleKeyDown}
            className="group flex flex-col items-center gap-1 rounded-lg border border-white/10 p-2 transition-all duration-500 animate-pulse hover:animate-none hover:border-[#D9408C]/30 hover:bg-white/[0.03] hover:shadow-[0_0_60px_-15px_rgba(217,64,140,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 md:gap-2 md:p-3"
            aria-label={t.openInMapsAriaLabel}
          >
            {/* Map Pin Icon */}
            <MapPinIcon className="h-4 w-4 text-white/50 transition-colors duration-500 group-hover:text-[#D9408C]/70 md:h-5 md:w-5" />

            {/* Venue Name */}
            <span className="text-sm font-medium line-clamp-2 text-white/80 md:text-base">
              {venue.name}
            </span>

            {/* Address (truncated on mobile) */}
            <span className="text-xs line-clamp-1 text-white/50 md:line-clamp-2">
              {venue.addressLine}
            </span>

            {/* Action Hint */}
            <span className="mt-0.5 flex items-center gap-1 text-[10px] text-white/40 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-[#D9408C]/60 md:text-xs">
              {t.tapToOpenMaps}
              <ArrowRightIcon className="w-2 h-2 md:h-3 md:w-3" />
            </span>
          </button>
        </AnimatedItem>
      </div>
    </div>
  );
}

/**
 * InfoGrid with Suspense boundary for useSearchParams
 */
export function InfoGrid(props: InfoGridProps) {
  return (
    <Suspense fallback={<InfoGridFallback />}>
      <InfoGridInner {...props} />
    </Suspense>
  );
}

/**
 * Fallback while loading (shows grid without quote)
 */
function InfoGridFallback() {
  return (
    <div className="flex flex-col items-center gap-6 text-center md:gap-8">
      <div className="grid w-full max-w-2xl grid-cols-3 gap-4 md:gap-8">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-10 h-10 rounded bg-white/10" />
          <div className="w-16 h-4 mt-2 rounded bg-white/10" />
        </div>
        <div className="flex flex-col items-center justify-center animate-pulse">
          <div className="w-16 h-8 rounded bg-white/10" />
        </div>
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-5 h-5 rounded-full bg-white/10" />
          <div className="w-20 h-4 mt-2 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}

/**
 * Map pin icon
 */
function MapPinIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

/**
 * Arrow right icon
 */
function ArrowRightIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
