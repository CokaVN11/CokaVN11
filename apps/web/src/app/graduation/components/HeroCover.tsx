// ABOUTME: Hero section for graduation invitation showing key event info
// ABOUTME: Displays name, date, time, venue, and CTAs prominently above the fold

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { eventConfig } from '@/data/graduation-event';
import { Button } from './ui/Button';
import { PolaroidCard } from './ui/PolaroidCard';
import { ConfettiBurst } from './ui/ConfettiBurst';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function HeroCover() {
  const { graduate, event, venue } = eventConfig;

  // Format date in Vietnamese style
  const eventDate = new Date(event.dateISO);
  const formattedDate = format(eventDate, "EEEE, dd/MM/yyyy", { locale: vi });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapsQuery)}`;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      <ConfettiBurst />

      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Graduate Name - H1 for SEO */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="text-5xl md:text-7xl font-display text-graduation-text"
        >
          {graduate.fullName}
        </motion.h1>

        {/* Event Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-graduation-text/80 font-body"
        >
          {event.title}
        </motion.p>

        {/* Polaroid Hero Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-md mx-auto"
        >
          <PolaroidCard variant="hero" tilt={3} caption="A journey begins">
            <div className="aspect-[4/5] bg-gradient-to-br from-graduation-primary/20 to-graduation-accent/20 rounded-2xl flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-graduation-text/60 italic">
                  Thêm ảnh tốt nghiệp của bạn tại đây
                </p>
                <p className="text-sm text-graduation-text/40 mt-2">
                  (Replace with your graduation photo)
                </p>
              </div>
            </div>
          </PolaroidCard>
        </motion.div>

        {/* Event Details - Core Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-3 text-graduation-text"
        >
          <p className="text-2xl md:text-3xl font-medium">
            {formattedDate}
          </p>
          <p className="text-xl md:text-2xl">
            {event.startTime} ({event.timezone})
          </p>
          <p className="text-lg md:text-xl text-graduation-text/80">
            {venue.name}
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            variant="primary"
            onClick={() => scrollToSection('rsvp')}
          >
            RSVP
          </Button>
          <Button
            variant="secondary"
            href={mapsUrl}
          >
            📍 Open in Google Maps
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
