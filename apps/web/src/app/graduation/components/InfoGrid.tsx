// ABOUTME: Info grid component displaying event date, time, and location
// ABOUTME: 2-column layout for date/time, full-width for location

'use client';

import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { InfoCell } from './InfoCell';
import { eventConfig } from '@/data/graduation-event';
import { REVEAL_STAGGER } from '../config/animations';

interface InfoGridProps {
  /** Whether reveal animations should play */
  isRevealed?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Info grid component for event details
 *
 * - 2-column grid: Date | Time
 * - Full-width row: Location with border-top
 * - Uses eventConfig data
 * - Staggered reveal animations
 */
export function InfoGrid({ isRevealed = false, className = '' }: InfoGridProps) {
  const { event, venue } = eventConfig;

  // Format date
  const eventDate = parseISO(event.dateISO);
  const formattedDate = format(eventDate, 'dd MMM yyyy', { locale: vi });
  const formattedDay = format(eventDate, 'EEEE', { locale: vi });

  // Format time
  const formattedTime = event.startTime;
  const timeSubtext = event.endTime
    ? `${event.startTime} - ${event.endTime}`
    : 'Start time';

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Date & Time row */}
      <div className="grid grid-cols-2 gap-8 py-8">
        <InfoCell
          label="Date"
          value={formattedDate}
          subtext={formattedDay}
          isRevealed={isRevealed}
          delay={0}
        />
        <InfoCell
          label="Time"
          value={formattedTime}
          subtext={timeSubtext}
          isRevealed={isRevealed}
          delay={REVEAL_STAGGER.infoCells}
        />
      </div>

      {/* Location row with border */}
      <div className="border-t border-grad-single-glass-10 py-8">
        <InfoCell
          label="Location"
          value={venue.name}
          subtext={venue.addressLine}
          isRevealed={isRevealed}
          delay={REVEAL_STAGGER.infoCells * 2}
        />
      </div>
    </div>
  );
}
