// ABOUTME: Footer section recapping essential event information
// ABOUTME: Provides a final summary and gratitude message

import React from 'react';
import { eventConfig } from '@/data/graduation-event';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function FooterRecap() {
  const { graduate, event, venue } = eventConfig;
  const eventDate = new Date(event.dateISO);
  const formattedDate = format(eventDate, "dd/MM/yyyy", { locale: vi });

  return (
    <footer className="bg-graduation-primary/5 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Gratitude */}
        <p className="text-2xl md:text-3xl font-display text-graduation-primary">
          Cảm ơn bạn rất nhiều!
        </p>
        <p className="text-lg text-graduation-text/80 font-body max-w-2xl mx-auto">
          Sự hiện diện của bạn là món quà ý nghĩa nhất cho tôi trong ngày đặc biệt này.
        </p>

        {/* Event Recap */}
        <div className="pt-8 pb-4 space-y-2 text-graduation-text/70 text-sm">
          <p>{graduate.fullName} - {graduate.degree}</p>
          <p>{formattedDate} • {event.startTime} • {venue.name}</p>
        </div>

        {/* Optional Hashtag */}
        <p className="text-graduation-primary text-sm font-medium">
          #GraduationDay2025 🎓✨
        </p>
      </div>
    </footer>
  );
}
