// ABOUTME: Floating chicken animation for graduation celebration
// ABOUTME: Responsive count: 6 mobile, 12 tablet, 18 desktop

'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ChickenProps {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

/**
 * Generate deterministic random chickens based on seed
 */
function generateChickens(count: number): ChickenProps[] {
  const chickens: ChickenProps[] = [];

  for (let i = 0; i < count; i++) {
    // Use index-based pseudo-random for consistent SSR/client render
    const seed = i * 137.5;
    chickens.push({
      id: i,
      left: 5 + ((seed * 7) % 90), // 5-95% horizontal position
      size: 40 + ((seed * 3) % 40), // 40-80px
      duration: 10 + ((seed * 2) % 8), // 10-18s
      delay: i * 0.8, // Staggered start
      rotation: -15 + ((seed * 5) % 30), // -15 to +15 degrees
    });
  }

  return chickens;
}

/**
 * Get chicken count based on screen width
 */
function getChickenCount(width: number): number {
  if (width < 768) return 6; // Mobile
  if (width < 1024) return 12; // Tablet
  return 18; // Desktop
}

export function FloatingChickens() {
  const shouldReduceMotion = useReducedMotion();
  const [chickenCount, setChickenCount] = useState(6); // SSR default

  // Detect screen width on mount
  useEffect(() => {
    setChickenCount(getChickenCount(window.innerWidth));
  }, []);

  // Generate chickens based on responsive count
  const chickens = useMemo(() => generateChickens(chickenCount), [chickenCount]);

  // Respect reduced motion preference
  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden="true">
      {chickens.map((chicken) => (
        <div
          key={chicken.id}
          className="absolute bottom-0 animate-float-up"
          style={
            {
              left: `${chicken.left}%`,
              '--duration': `${chicken.duration}s`,
              '--delay': `${chicken.delay}s`,
            } as React.CSSProperties
          }
        >
          <Image
            src="/chicken_love.png"
            alt=""
            width={chicken.size}
            height={chicken.size}
            className="select-none"
            style={{ transform: `rotate(${chicken.rotation}deg)` }}
            loading="lazy"
            priority={false}
          />
        </div>
      ))}
    </div>
  );
}
