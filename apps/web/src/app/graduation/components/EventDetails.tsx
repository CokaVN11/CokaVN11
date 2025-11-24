// ABOUTME: Event details grid showing logistics at a glance
// ABOUTME: Displays date, time, venue, address, and parking in card format

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { eventConfig } from '@/data/graduation-event';
import { Section } from './ui/Section';
import { PolaroidCard } from './ui/PolaroidCard';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function EventDetails() {
  const { event, venue } = eventConfig;

  const eventDate = new Date(event.dateISO);
  const formattedDate = format(eventDate, "EEEE, dd/MM/yyyy", { locale: vi });

  const cards = [
    {
      icon: '📅',
      title: 'Ngày',
      content: formattedDate,
    },
    {
      icon: '⏰',
      title: 'Thời gian',
      content: `${event.startTime} (${event.timezone})`,
    },
    {
      icon: '🎓',
      title: 'Địa điểm',
      content: venue.name,
    },
    {
      icon: '📍',
      title: 'Địa chỉ',
      content: venue.addressLine,
    },
  ];

  return (
    <Section title="Chi tiết sự kiện">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <PolaroidCard variant="standard" tilt={Math.random() * 4 - 2}>
              <div className="text-center space-y-3 p-3">
                <div className="text-4xl">{card.icon}</div>
                <h3 className="font-display text-xl text-graduation-primary">
                  {card.title}
                </h3>
                <p className="text-graduation-text/80 font-body">
                  {card.content}
                </p>
              </div>
            </PolaroidCard>
          </motion.div>
        ))}
      </div>

      {/* Parking Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 max-w-md mx-auto"
      >
        <PolaroidCard variant="note" tilt={-2}>
          <p className="text-graduation-text text-sm font-body italic">
            💡 <strong>Lưu ý:</strong> {venue.parkingNote}
          </p>
        </PolaroidCard>
      </motion.div>
    </Section>
  );
}
