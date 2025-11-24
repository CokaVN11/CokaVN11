// ABOUTME: Gallery component displaying images in polaroid style with random tilts
// ABOUTME: Optional component for showcasing graduation photos and memories

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { eventConfig } from '@/data/graduation-event';
import { Section } from './ui/Section';
import { PolaroidCard } from './ui/PolaroidCard';
import Image from 'next/image';

export function GalleryPolaroid() {
  const { gallery } = eventConfig;

  // Don't render if no images
  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <Section title="Khoảnh khắc đáng nhớ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {gallery.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <PolaroidCard
              variant="standard"
              caption={image.alt}
              tilt={Math.random() * 6 - 3} // Random tilt between -3 and 3
            >
              <div className="relative aspect-square">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover rounded-2xl"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </PolaroidCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
