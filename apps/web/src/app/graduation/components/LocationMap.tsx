// ABOUTME: Location map section with embedded Google Maps and link
// ABOUTME: Shows venue location and provides quick access to navigation

'use client';

import React from 'react';
import { eventConfig } from '@/data/graduation-event';
import { Section } from './ui/Section';
import { Button } from './ui/Button';

export function LocationMap() {
  const { venue } = eventConfig;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapsQuery)}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(venue.mapsQuery)}&output=embed`;

  return (
    <Section title="Bản đồ">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Map Embed */}
        <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-xl border-4 border-graduation-card">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Venue Location Map"
          />
        </div>

        {/* Address and CTA */}
        <div className="text-center space-y-4">
          <p className="text-graduation-text font-body text-lg">
            {venue.addressLine}
          </p>
          <Button variant="primary" href={mapsUrl}>
            📍 Mở trong Google Maps
          </Button>
          <p className="text-graduation-text/70 text-sm italic">
            {venue.parkingNote}
          </p>
        </div>
      </div>
    </Section>
  );
}
