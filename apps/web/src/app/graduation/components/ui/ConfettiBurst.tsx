// ABOUTME: Confetti animation component for celebratory effect on hero section
// ABOUTME: Respects user's motion preferences and triggers once on mount

'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ConfettiBurstProps {
  duration?: number;
  particleCount?: number;
}

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({
  duration = 3000,
  particleCount = 30,
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Don't show confetti if user prefers reduced motion
    if (shouldReduceMotion) return;

    const colors = ['#0B6FBF', '#FFE1A8', '#F3F4F6', '#FDF9F2'];
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * -100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, particleCount, shouldReduceMotion]);

  if (shouldReduceMotion || particles.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: '50vw',
            y: '0vh',
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: `calc(50vw + ${particle.x}vw)`,
            y: '100vh',
            opacity: 0,
            rotate: 360,
          }}
          transition={{
            duration: duration / 1000,
            delay: particle.delay,
            ease: 'easeOut',
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  );
};
