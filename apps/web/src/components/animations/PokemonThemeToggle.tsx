'use client';

import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import {
  themeVariants,
  POKEMON_TIMING,
  POKEMON_EASING,
  POKEMON_COLORS,
  useReducedMotion,
  createAnimationProps,
} from './pokemon-motion';

// Theme context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const usePokemonTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('usePokemonTheme must be used within PokemonThemeProvider');
  }
  return context;
};

interface PokemonThemeProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
}

export const PokemonThemeProvider: React.FC<PokemonThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check system preferences
  useEffect(() => {
    // Check system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.matches && defaultTheme === 'light') {
      setTheme('dark');
    }

    // Check reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(reducedMotionQuery.matches);

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, [defaultTheme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Apply reduced motion
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduced-motion');
    }
  }, [reducedMotion]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, reducedMotion, setReducedMotion }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Pokemon-style theme toggle button
interface PokemonThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  reducedMotion?: boolean;
}

export const PokemonThemeToggle: React.FC<PokemonThemeToggleProps> = ({
  className = '',
  showLabel = false,
  reducedMotion: externalReducedMotion,
}) => {
  const { theme, toggleTheme, reducedMotion: contextReducedMotion } = usePokemonTheme();
  const reducedMotion = externalReducedMotion ?? contextReducedMotion;

  const animationProps = createAnimationProps(
    POKEMON_TIMING.normal,
    POKEMON_EASING.smooth,
    reducedMotion
  );

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative flex items-center space-x-2 p-3 border-2 border-black rounded-lg
        bg-white dark:bg-black text-black dark:text-white
        hover:bg-gray-100 dark:hover:bg-gray-900
        transition-colors cursor-pointer
        ${className}
      `}
      whileHover={
        !reducedMotion
          ? {
              scale: 1.05,
              transition: {
                duration: POKEMON_TIMING.fast / 1000,
                ease: POKEMON_EASING.snappy,
              },
            }
          : {}
      }
      whileTap={
        !reducedMotion
          ? {
              scale: 0.95,
              transition: {
                duration: 50 / 1000,
                ease: POKEMON_EASING.snappy,
              },
            }
          : {}
      }
      {...animationProps}
    >
      {/* Sun icon for light theme */}
      <AnimatePresence mode="wait">
        {theme === 'light' ? (
          <motion.svg
            key="sun"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{
              duration: reducedMotion ? 0 : POKEMON_TIMING.normal / 1000,
              ease: POKEMON_EASING.smooth,
            }}
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{
              duration: reducedMotion ? 0 : POKEMON_TIMING.normal / 1000,
              ease: POKEMON_EASING.smooth,
            }}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        )}
      </AnimatePresence>

      {showLabel && (
        <motion.span
          className="font-bold text-sm"
          key={theme}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: reducedMotion ? 0 : POKEMON_TIMING.fast / 1000,
            ease: POKEMON_EASING.snappy,
          }}
        >
          {theme === 'light' ? 'Light' : 'Dark'}
        </motion.span>
      )}

      {/* Pokemon-style pixel border effect */}
      <div
        className="absolute inset-0 pointer-events-none rounded-lg border-2 border-black"
        style={{
          boxShadow: `
            inset -2px -2px 0px 0px rgba(0,0,0,0.1),
            inset 2px 2px 0px 0px rgba(255,255,255,0.1)
          `,
        }}
      />
    </motion.button>
  );
};

// Animated theme transition overlay
interface PokemonThemeTransitionProps {
  children: ReactNode;
  duration?: number;
}

export const PokemonThemeTransition: React.FC<PokemonThemeTransitionProps> = ({
  children,
  duration = POKEMON_TIMING.slow,
}) => {
  const { theme, reducedMotion } = usePokemonTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), duration);
    return () => clearTimeout(timer);
  }, [theme, duration]);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: duration / 1000,
            ease: POKEMON_EASING.smooth,
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Theme transition overlay effect */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            style={{
              background:
                theme === 'dark'
                  ? 'linear-gradient(45deg, #1a1a1a, #2d2d2d)'
                  : 'linear-gradient(45deg, #ffffff, #f0f0f0)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 2000,
              ease: POKEMON_EASING.smooth,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Reduced motion toggle button
interface PokemonReducedMotionToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const PokemonReducedMotionToggle: React.FC<PokemonReducedMotionToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { reducedMotion, setReducedMotion } = usePokemonTheme();

  return (
    <motion.button
      onClick={() => setReducedMotion(!reducedMotion)}
      className={`
        relative flex items-center space-x-2 p-3 border-2 border-black rounded-lg
        ${reducedMotion ? 'bg-blue-500 text-white' : 'bg-white text-black'}
        hover:opacity-80 transition-opacity cursor-pointer
        ${className}
      `}
      whileHover={{
        scale: 1.05,
        transition: {
          duration: POKEMON_TIMING.fast / 1000,
          ease: POKEMON_EASING.snappy,
        },
      }}
      whileTap={{
        scale: 0.95,
        transition: {
          duration: 50 / 1000,
          ease: POKEMON_EASING.snappy,
        },
      }}
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={reducedMotion ? { pathLength: 0.3 } : { pathLength: 1 }}
        transition={{
          duration: POKEMON_TIMING.normal / 1000,
          ease: POKEMON_EASING.smooth,
        }}
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </motion.svg>

      {showLabel && <span className="font-bold text-sm">{reducedMotion ? 'Reduced' : 'Full'}</span>}

      {/* Pokemon-style pixel border effect */}
      <div
        className="absolute inset-0 pointer-events-none rounded-lg border-2 border-black"
        style={{
          boxShadow: `
            inset -2px -2px 0px 0px rgba(0,0,0,0.1),
            inset 2px 2px 0px 0px rgba(255,255,255,0.1)
          `,
        }}
      />
    </motion.button>
  );
};

// Theme-aware Pokemon background component
interface PokemonBackgroundProps {
  children: ReactNode;
  className?: string;
  pattern?: 'dots' | 'lines' | 'grid';
}

export const PokemonBackground: React.FC<PokemonBackgroundProps> = ({
  children,
  className = '',
  pattern = 'dots',
}) => {
  const { theme } = usePokemonTheme();

  const getPatternStyles = () => {
    const basePattern = theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';

    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle, ${basePattern} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'lines':
        return {
          backgroundImage: `repeating-linear-gradient(45deg, ${basePattern}, ${basePattern} 1px, transparent 1px, transparent 10px)`,
        };
      case 'grid':
        return {
          backgroundImage: `
            repeating-linear-gradient(0deg, ${basePattern}, ${basePattern} 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(90deg, ${basePattern}, ${basePattern} 1px, transparent 1px, transparent 20px)
          `,
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={className}
      style={getPatternStyles()}
      animate={{
        backgroundColor: theme === 'dark' ? '#0a0a0a' : '#fafafa',
      }}
      transition={{
        duration: POKEMON_TIMING.slow / 1000,
        ease: POKEMON_EASING.smooth,
      }}
    >
      {children}
    </motion.div>
  );
};
