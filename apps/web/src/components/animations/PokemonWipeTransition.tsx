'use client';

import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import {
  wipeVariants,
  POKEMON_TIMING,
  POKEMON_EASING,
  POKEMON_COLORS,
  useReducedMotion,
  createAnimationProps,
} from './pokemon-motion';

interface PokemonWipeTransitionProps extends MotionProps {
  children: ReactNode;
  isVisible: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  className?: string;
  reducedMotion?: boolean;
}

export const PokemonWipeTransition: React.FC<PokemonWipeTransitionProps> = ({
  children,
  isVisible,
  direction = 'right',
  duration = POKEMON_TIMING.slow,
  className = '',
  reducedMotion: externalReducedMotion,
  ...motionProps
}) => {
  const internalReducedMotion = useReducedMotion();
  const reducedMotion = externalReducedMotion ?? internalReducedMotion;

  // Direction-specific variants
  const getDirectionVariants = () => {
    switch (direction) {
      case 'left':
        return {
          hidden: { clipPath: 'inset(0 0 0 100%)' },
          visible: { clipPath: 'inset(0 0 0 0%)' },
          exit: { clipPath: 'inset(0 100% 0 0)' },
        };
      case 'right':
        return {
          hidden: { clipPath: 'inset(0 100% 0 0)' },
          visible: { clipPath: 'inset(0 0% 0 0)' },
          exit: { clipPath: 'inset(0 0 0 100%)' },
        };
      case 'up':
        return {
          hidden: { clipPath: 'inset(100% 0 0 0)' },
          visible: { clipPath: 'inset(0% 0 0 0)' },
          exit: { clipPath: 'inset(0 0 100% 0)' },
        };
      case 'down':
        return {
          hidden: { clipPath: 'inset(0 0 100% 0)' },
          visible: { clipPath: 'inset(0 0 0% 0)' },
          exit: { clipPath: 'inset(100% 0 0 0)' },
        };
      default:
        return wipeVariants;
    }
  };

  const animationProps = createAnimationProps(duration, POKEMON_EASING.smooth, reducedMotion);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={className}
          variants={getDirectionVariants()}
          initial="hidden"
          animate="visible"
          exit="exit"
          {...animationProps}
          {...motionProps}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Full-screen wipe transition component
interface PokemonScreenWipeProps {
  children: ReactNode;
  isComplete: boolean;
  onWipeComplete?: () => void;
  color?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
}

export const PokemonScreenWipe: React.FC<PokemonScreenWipeProps> = ({
  children,
  isComplete,
  onWipeComplete,
  color = POKEMON_COLORS.white,
  direction = 'right',
  duration = POKEMON_TIMING.slow,
}) => {
  const [showWipe, setShowWipe] = useState(false);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    if (isComplete) {
      // Start wipe effect
      setShowWipe(true);
      setShowContent(false);

      // Show content after wipe completes
      const timer = setTimeout(() => {
        setShowWipe(false);
        setShowContent(true);
        onWipeComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isComplete, duration, onWipeComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Current content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration / 2000 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wipe overlay */}
      <AnimatePresence>
        {showWipe && (
          <motion.div
            className="absolute inset-0 z-50"
            style={{ backgroundColor: color }}
            variants={getWipeVariants(direction)}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: duration / 1000,
              ease: POKEMON_EASING.smooth,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to get wipe variants
const getWipeVariants = (direction: string) => {
  switch (direction) {
    case 'left':
      return {
        hidden: { x: '100%' },
        visible: { x: 0 },
        exit: { x: '-100%' },
      };
    case 'right':
      return {
        hidden: { x: '-100%' },
        visible: { x: 0 },
        exit: { x: '100%' },
      };
    case 'up':
      return {
        hidden: { y: '100%' },
        visible: { y: 0 },
        exit: { y: '-100%' },
      };
    case 'down':
      return {
        hidden: { y: '-100%' },
        visible: { y: 0 },
        exit: { y: '100%' },
      };
    default:
      return {
        hidden: { x: '-100%' },
        visible: { x: 0 },
        exit: { x: '100%' },
      };
  }
};

// Pokemon-style battle transition effect
interface PokemonBattleTransitionProps {
  children: ReactNode;
  isTransitioning: boolean;
  onTransitionComplete?: () => void;
}

export const PokemonBattleTransition: React.FC<PokemonBattleTransitionProps> = ({
  children,
  isTransitioning,
  onTransitionComplete,
}) => {
  const [phase, setPhase] = useState<'idle' | 'zoom' | 'flash' | 'complete'>('idle');

  useEffect(() => {
    if (isTransitioning) {
      setPhase('zoom');

      // Flash effect
      setTimeout(() => setPhase('flash'), 200);

      // Complete transition
      setTimeout(() => {
        setPhase('complete');
        onTransitionComplete?.();
      }, 400);
    } else {
      setPhase('idle');
    }
  }, [isTransitioning, onTransitionComplete]);

  const getAnimationVariants = () => {
    switch (phase) {
      case 'zoom':
        return {
          scale: 1.5,
          filter: 'brightness(1.5)',
          transition: { duration: 0.2, ease: 'easeIn' },
        };
      case 'flash':
        return {
          scale: 2,
          filter: 'brightness(2)',
          opacity: 1,
          transition: { duration: 0.1 },
        };
      case 'complete':
        return {
          scale: 1,
          filter: 'brightness(1)',
          opacity: 0,
          transition: { duration: 0.1, ease: 'easeOut' },
        };
      default:
        return {
          scale: 1,
          filter: 'brightness(1)',
          opacity: 1,
        };
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence>
        {phase !== 'complete' && (
          <motion.div
            className="absolute inset-0 bg-white z-50"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
              exit: { opacity: 0 },
            }}
            initial="hidden"
            animate={phase === 'idle' ? 'hidden' : 'visible'}
            exit="exit"
            transition={{ duration: 0.1 }}
          >
            <motion.div
              className="w-full h-full bg-gradient-to-br from-red-500 to-blue-500"
              animate={getAnimationVariants()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === 'complete' && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Page transition wrapper for Next.js
interface PokemonPageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PokemonPageTransition: React.FC<PokemonPageTransitionProps> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 100, filter: 'blur(8px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: -100, filter: 'blur(8px)' }}
      transition={{
        duration: POKEMON_TIMING.normal / 1000,
        ease: POKEMON_EASING.expoOut,
      }}
    >
      {children}
    </motion.div>
  );
};
