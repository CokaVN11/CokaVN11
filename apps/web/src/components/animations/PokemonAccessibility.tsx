'use client';

import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { ReactNode, useEffect, useState, useRef } from 'react';
import { POKEMON_TIMING, POKEMON_EASING, useReducedMotion } from './pokemon-motion';

// Accessibility hook for comprehensive motion preferences
export const useAccessibilityPreferences = () => {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    prefersDark: false,
    highContrast: false,
    reducedTransparency: false,
    screenReader: false,
  });

  useEffect(() => {
    // Check for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Check for dark mode preference
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    // Check for high contrast
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    // Check for reduced transparency
    const transparencyQuery = window.matchMedia('(prefers-reduced-transparency: reduce)');

    const updatePreferences = () => {
      setPreferences({
        reducedMotion: motionQuery.matches,
        prefersDark: darkQuery.matches,
        highContrast: contrastQuery.matches,
        reducedTransparency: transparencyQuery.matches,
        screenReader: window.speechSynthesis !== undefined,
      });
    };

    updatePreferences();

    // Add listeners
    const motionListener = () => updatePreferences();
    const darkListener = () => updatePreferences();
    const contrastListener = () => updatePreferences();
    const transparencyListener = () => updatePreferences();

    motionQuery.addEventListener('change', motionListener);
    darkQuery.addEventListener('change', darkListener);
    contrastQuery.addEventListener('change', contrastListener);
    transparencyQuery.addEventListener('change', transparencyListener);

    return () => {
      motionQuery.removeEventListener('change', motionListener);
      darkQuery.removeEventListener('change', darkListener);
      contrastQuery.removeEventListener('change', contrastListener);
      transparencyQuery.removeEventListener('change', transparencyListener);
    };
  }, []);

  return preferences;
};

// Accessible animation wrapper
interface AccessibleMotionProps extends MotionProps {
  children: ReactNode;
  fallback?: ReactNode;
  respectReducedMotion?: boolean;
  announceToScreenReader?: string;
  ariaLabel?: string;
  role?: string;
}

export const AccessibleMotion: React.FC<AccessibleMotionProps> = ({
  children,
  fallback,
  respectReducedMotion = true,
  announceToScreenReader,
  ariaLabel,
  role,
  ...motionProps
}) => {
  const { reducedMotion, screenReader } = useAccessibilityPreferences();
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const announcementRef = useRef<HTMLDivElement>(null);

  // Handle screen reader announcements
  useEffect(() => {
    if (announceToScreenReader && screenReader && announcementRef.current) {
      announcementRef.current.textContent = announceToScreenReader;
      // Clear announcement after delay
      const timer = setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [announceToScreenReader, screenReader]);

  // Determine if animations should be disabled
  useEffect(() => {
    if (respectReducedMotion && reducedMotion) {
      setShouldAnimate(false);
    } else {
      setShouldAnimate(true);
    }
  }, [respectReducedMotion, reducedMotion]);

  if (!shouldAnimate) {
    return (
      <div aria-label={ariaLabel} role={role}>
        {fallback || children}
        <div ref={announcementRef} className="sr-only" aria-live="polite" aria-atomic="true" />
      </div>
    );
  }

  return (
    <motion.div aria-label={ariaLabel} role={role} {...motionProps}>
      {children}
      <div ref={announcementRef} className="sr-only" aria-live="polite" aria-atomic="true" />
    </motion.div>
  );
};

// Focus-visible animated button
interface AccessiblePokemonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const AccessiblePokemonButton: React.FC<AccessiblePokemonButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ariaLabel,
  ariaDescribedBy,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { reducedMotion } = useAccessibilityPreferences();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-700';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600 text-white border-gray-700';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white border-red-700';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white border-green-700';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-700';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1 text-sm';
      case 'md':
        return 'px-6 py-2 text-base';
      case 'lg':
        return 'px-8 py-3 text-lg';
      default:
        return 'px-6 py-2 text-base';
    }
  };

  return (
    <motion.button
      className={`
        relative font-bold border-2 rounded focus:outline-none
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      whileHover={
        !disabled && !reducedMotion
          ? {
              scale: 1.02,
              transition: {
                duration: POKEMON_TIMING.fast / 1000,
                ease: POKEMON_EASING.snappy,
              },
            }
          : {}
      }
      whileTap={
        !disabled && !reducedMotion
          ? {
              scale: 0.98,
              transition: {
                duration: 50 / 1000,
                ease: POKEMON_EASING.snappy,
              },
            }
          : {}
      }
    >
      {/* Focus indicator */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute inset-0 border-4 border-yellow-400 rounded-lg pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: reducedMotion ? 0 : POKEMON_TIMING.fast / 1000,
              ease: POKEMON_EASING.snappy,
            }}
          />
        )}
      </AnimatePresence>

      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Accessible modal/panel with keyboard navigation
interface AccessiblePokemonPanelProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  className?: string;
}

export const AccessiblePokemonPanel: React.FC<AccessiblePokemonPanelProps> = ({
  children,
  isOpen,
  onClose,
  title,
  description,
  className = '',
}) => {
  const { reducedMotion } = useAccessibilityPreferences();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus the panel
      setTimeout(() => {
        panelRef.current?.focus();
      }, 100);

      // Trap focus within panel
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }

        if (e.key === 'Tab') {
          const focusableElements = panelRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as NodeListOf<HTMLElement>;

          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';

        // Restore previous focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: reducedMotion ? 0 : POKEMON_TIMING.normal / 1000,
          ease: POKEMON_EASING.expoOut,
        }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Panel */}
        <motion.div
          ref={panelRef}
          className={`
            relative bg-white border-4 border-black rounded-lg shadow-2xl max-w-md w-full mx-4
            focus:outline-none
            ${className}
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby="panel-title"
          aria-describedby={description ? 'panel-description' : undefined}
          tabIndex={-1}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{
            duration: reducedMotion ? 0 : POKEMON_TIMING.normal / 1000,
            ease: POKEMON_EASING.expoOut,
          }}
        >
          {/* Panel header */}
          <div className="bg-gradient-to-r from-red-500 to-blue-500 p-4 border-b-4 border-black">
            <h2 id="panel-title" className="text-white font-bold text-lg">
              {title}
            </h2>
            {description && (
              <p id="panel-description" className="text-white text-sm mt-1 opacity-90">
                {description}
              </p>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              aria-label="Close panel"
            >
              ×
            </button>
          </div>

          {/* Panel content */}
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Accessible progress indicator
interface AccessibleProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export const AccessibleProgress: React.FC<AccessibleProgressProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  className = '',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div
      className={className}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      {label && <div className="text-sm font-bold mb-1">{label}</div>}
      <div className="w-full bg-gray-300 border-2 border-black rounded relative">
        <motion.div
          className="h-4 bg-green-500 rounded border-2 border-black"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: POKEMON_TIMING.normal / 1000,
            ease: POKEMON_EASING.expoOut,
          }}
        />
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    </div>
  );
};

// Skip link component for accessibility
interface SkipLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children, className = '' }) => {
  return (
    <a
      href={href}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
        bg-blue-500 text-white px-4 py-2 rounded font-bold
        focus:outline-none focus:ring-2 focus:ring-yellow-400 z-50
        ${className}
      `}
    >
      {children}
    </a>
  );
};

// High contrast mode detector and utilities
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
};

// Screen reader safe text animation
interface AccessibleTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const AccessibleText: React.FC<AccessibleTextProps> = ({
  children,
  delay = 0,
  className = '',
}) => {
  const { reducedMotion, screenReader } = useAccessibilityPreferences();

  if (reducedMotion || screenReader) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: POKEMON_TIMING.normal / 1000,
        ease: POKEMON_EASING.expoOut,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
};
