'use client';

import { motion, AnimatePresence, MotionProps, useAnimation } from 'framer-motion';
import { ReactNode, useEffect, useState, useRef, useCallback } from 'react';
import { POKEMON_TIMING, POKEMON_EASING, useReducedMotion } from './pokemon-motion';

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [fps, setFps] = useState(60);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationId: number;

    const measurePerformance = () => {
      frameCount.current++;
      const currentTime = performance.now();

      if (currentTime >= lastTime.current + 1000) {
        const currentFps = Math.round(
          (frameCount.current * 1000) / (currentTime - lastTime.current)
        );
        setFps(currentFps);
        setIsLowPerformance(currentFps < 30);

        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return { fps, isLowPerformance };
};

// Intersection Observer hook for lazy animations
export const useIntersectionObserver = (options: IntersectionObserverInit = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasIntersected, options]);

  return { ref, isIntersecting, hasIntersected };
};

// Optimized animation component with performance considerations
interface OptimizedMotionProps extends MotionProps {
  children: ReactNode;
  disabled?: boolean;
  reducedMotion?: boolean;
  performanceMode?: 'high' | 'medium' | 'low';
  lazy?: boolean;
}

export const OptimizedMotion: React.FC<OptimizedMotionProps> = ({
  children,
  disabled = false,
  reducedMotion: externalReducedMotion,
  performanceMode = 'medium',
  lazy = false,
  ...motionProps
}) => {
  const internalReducedMotion = useReducedMotion();
  const reducedMotion = externalReducedMotion ?? internalReducedMotion;
  const { isLowPerformance } = usePerformanceMonitor();
  const { ref, hasIntersected } = useIntersectionObserver();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Determine if animations should be enabled
  const shouldEnableAnimation = !disabled && !reducedMotion && shouldAnimate;

  // Adjust animation based on performance
  const getAdjustedAnimation = useCallback(() => {
    if (reducedMotion || disabled) {
      return { initial: false, animate: true, transition: { duration: 0 } };
    }

    switch (performanceMode) {
      case 'high':
        return motionProps;
      case 'medium':
        return {
          ...motionProps,
          transition: {
            ...motionProps.transition,
            duration: ((motionProps.transition as any)?.duration || 0.3) * 0.7,
          },
        };
      case 'low':
        return {
          ...motionProps,
          transition: {
            ...motionProps.transition,
            duration: ((motionProps.transition as any)?.duration || 0.3) * 0.4,
          },
        };
      default:
        return motionProps;
    }
  }, [motionProps, performanceMode, reducedMotion, disabled]);

  // Auto-adjust performance mode based on device performance
  useEffect(() => {
    if (isLowPerformance && performanceMode === 'high') {
      setShouldAnimate(false);
    } else if (!isLowPerformance) {
      setShouldAnimate(true);
    }
  }, [isLowPerformance, performanceMode]);

  // Lazy loading logic
  if (lazy && !hasIntersected) {
    return <div ref={ref}>{children}</div>;
  }

  if (!shouldEnableAnimation) {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <motion.div ref={ref} {...getAdjustedAnimation()}>
      {children}
    </motion.div>
  );
};

// SSG-safe animation wrapper
interface SSGLazyMotionProps {
  children: ReactNode;
  fallback?: ReactNode;
  animations?: MotionProps;
  disabled?: boolean;
}

export const SSGLazyMotion: React.FC<SSGLazyMotionProps> = ({
  children,
  fallback,
  animations,
  disabled = false,
}) => {
  const [isClient, setIsClient] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Server-side rendering fallback
  if (!isClient) {
    return <>{fallback || children}</>;
  }

  // Client-side with animations
  if (disabled || reducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={animations?.initial || { opacity: 0 }}
      animate={animations?.animate || { opacity: 1 }}
      transition={
        animations?.transition || {
          duration: POKEMON_TIMING.normal / 1000,
          ease: POKEMON_EASING.expoOut,
        }
      }
    >
      {children}
    </motion.div>
  );
};

// Batched animation component for better performance
interface BatchedAnimationsProps {
  children: ReactNode;
  animations: Array<{
    selector: string;
    animation: MotionProps;
  }>;
  stagger?: number;
}

export const BatchedAnimations: React.FC<BatchedAnimationsProps> = ({
  children,
  animations,
  stagger = 100,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { ref, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    if (hasIntersected) {
      setIsVisible(true);
    }
  }, [hasIntersected]);

  return (
    <div ref={ref} className="relative">
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const animation = animations[index % animations.length];

        return (
          <OptimizedMotion key={index} {...animation.animation} lazy={true}>
            <div
              style={{
                animationDelay: isVisible ? `${index * stagger}ms` : '0ms',
              }}
            >
              {child}
            </div>
          </OptimizedMotion>
        );
      })}
    </div>
  );
};

// Performance-aware Pokemon panel
interface OptimizedPokemonPanelProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  performanceMode?: 'high' | 'medium' | 'low';
}

export const OptimizedPokemonPanel: React.FC<OptimizedPokemonPanelProps> = ({
  children,
  isOpen,
  onClose,
  performanceMode = 'medium',
}) => {
  const controls = useAnimation();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (isOpen) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [isOpen, controls]);

  const variants = {
    hidden: {
      x: '-100%',
      opacity: 0,
      transition: {
        duration: performanceMode === 'high' ? 0.3 : performanceMode === 'medium' ? 0.2 : 0.1,
        ease: POKEMON_EASING.expoOut,
      },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: performanceMode === 'high' ? 0.25 : performanceMode === 'medium' ? 0.175 : 0.0875,
        ease: POKEMON_EASING.expoOut,
      },
    },
  };

  if (reducedMotion) {
    return isOpen ? (
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50">{children}</div>
    ) : null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50"
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onAnimationComplete={() => {
            // Cleanup animations when complete
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Memory-efficient sprite animation
interface PokemonSpriteProps {
  frames: string[];
  frameWidth: number;
  frameHeight: number;
  interval: number;
  isPlaying?: boolean;
  className?: string;
}

export const PokemonSprite: React.FC<PokemonSpriteProps> = ({
  frames,
  frameWidth,
  frameHeight,
  interval,
  isPlaying = true,
  className = '',
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { ref } = useIntersectionObserver();

  useEffect(() => {
    if (!isPlaying || !isVisible) return;

    const intervalId = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [isPlaying, isVisible, frames.length, interval]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        className="transition-none"
        style={{
          width: frameWidth,
          height: frameHeight,
          backgroundImage: `url(${frames[currentFrame]})`,
          backgroundSize: `${frameWidth * frames.length}px ${frameHeight}`,
          backgroundPosition: `-${currentFrame * frameWidth}px 0`,
        }}
      />
    </div>
  );
};

// Debounced resize handler for responsive animations
export const useDebouncedResize = (callback: () => void, delay: number = 250) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(callback, delay);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [callback, delay]);
};

// Animation performance utilities
export const AnimationUtils = {
  // Check if device supports hardware acceleration
  supportsHardwareAcceleration: () => {
    const testEl = document.createElement('div');
    testEl.style.transform = 'translateZ(0)';
    return testEl.style.transform !== '';
  },

  // Get device performance tier
  getPerformanceTier: (): 'high' | 'medium' | 'low' => {
    const connection = (navigator as any).connection;
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency;

    // High-end devices
    if (cores >= 8 && memory >= 8) return 'high';

    // Low-end devices
    if (cores <= 2 || memory <= 2 || (connection && connection.effectiveType === 'slow-2g')) {
      return 'low';
    }

    return 'medium';
  },

  // Optimize animation properties based on device
  optimizeForDevice: (originalProps: MotionProps) => {
    const tier = AnimationUtils.getPerformanceTier();

    switch (tier) {
      case 'high':
        return originalProps;
      case 'medium':
        return {
          ...originalProps,
          transition: {
            ...originalProps.transition,
            duration: ((originalProps.transition as any)?.duration || 0.3) * 0.7,
          },
        };
      case 'low':
        return {
          ...originalProps,
          transition: {
            ...originalProps.transition,
            duration: ((originalProps.transition as any)?.duration || 0.3) * 0.4,
          },
        };
      default:
        return originalProps;
    }
  },
};
