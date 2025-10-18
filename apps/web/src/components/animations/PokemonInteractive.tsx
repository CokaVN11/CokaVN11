'use client';

import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { ReactNode, useState, useRef, useEffect } from 'react';
import {
  buttonVariants,
  textRevealVariants,
  staggerContainer,
  staggerItem,
  notificationVariants,
  pixelBorderVariants,
  POKEMON_TIMING,
  POKEMON_EASING,
  POKEMON_COLORS,
  useReducedMotion,
  createAnimationProps,
} from './pokemon-motion';

// Pokemon-style button with GBA timing
interface PokemonButtonProps extends MotionProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  reducedMotion?: boolean;
}

export const PokemonButton: React.FC<PokemonButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  reducedMotion: externalReducedMotion,
  ...motionProps
}) => {
  const internalReducedMotion = useReducedMotion();
  const reducedMotion = externalReducedMotion ?? internalReducedMotion;
  const [isPressed, setIsPressed] = useState(false);

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

  const animationProps = createAnimationProps(
    POKEMON_TIMING.fast,
    POKEMON_EASING.snappy,
    reducedMotion
  );

  return (
    <motion.button
      className={`
        relative font-bold border-2 rounded
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      variants={!reducedMotion ? buttonVariants : undefined}
      initial="idle"
      whileHover={!disabled && !reducedMotion ? 'hover' : undefined}
      whileTap={!disabled && !reducedMotion ? 'tap' : undefined}
      disabled={disabled}
      onClick={!disabled && !loading ? onClick : undefined}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...animationProps}
      {...motionProps}
    >
      {/* Loading state */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-4 h-4 bg-current rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button content */}
      <motion.span animate={{ opacity: loading ? 0 : 1 }} transition={{ duration: 0.1 }}>
        {children}
      </motion.span>

      {/* Pokemon-style pixel border effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none border-2 border-black rounded"
        variants={!reducedMotion ? pixelBorderVariants : undefined}
        animate={isPressed ? 'active' : 'idle'}
      />
    </motion.button>
  );
};

// Pokemon-style card with hover effects
interface PokemonCardProps {
  children: ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  className?: string;
  hover?: boolean;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  children,
  onClick,
  isSelected = false,
  disabled = false,
  className = '',
  hover = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`
        relative bg-white border-4 border-black rounded-lg p-6
        ${hover && !disabled ? 'cursor-pointer' : 'cursor-default'}
        ${disabled ? 'opacity-50' : ''}
        ${isSelected ? 'ring-4 ring-blue-500' : ''}
        ${className}
      `}
      whileHover={
        hover && !disabled
          ? {
              y: -4,
              scale: 1.02,
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              transition: {
                duration: POKEMON_TIMING.fast / 1000,
                ease: POKEMON_EASING.snappy,
              },
            }
          : {}
      }
      whileTap={
        hover && !disabled
          ? {
              scale: 0.98,
              transition: {
                duration: 50 / 1000,
                ease: POKEMON_EASING.snappy,
              },
            }
          : {}
      }
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card content */}
      <div className="relative z-10">{children}</div>

      {/* Pokemon-style shadow and highlight effects */}
      <div
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          boxShadow: `
            inset -2px -2px 0px 0px rgba(0,0,0,0.1),
            inset 2px 2px 0px 0px rgba(255,255,255,0.1)
          `,
        }}
      />

      {/* Hover effect overlay */}
      <AnimatePresence>
        {isHovered && hover && !disabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: POKEMON_TIMING.fast / 1000,
              ease: POKEMON_EASING.snappy,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Pokemon-style text reveal animation
interface PokemonTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  reducedMotion?: boolean;
}

export const PokemonText: React.FC<PokemonTextProps> = ({
  children,
  delay = 0,
  className = '',
  reducedMotion: externalReducedMotion,
}) => {
  const internalReducedMotion = useReducedMotion();
  const reducedMotion = externalReducedMotion ?? internalReducedMotion;

  return (
    <motion.div
      className={className}
      variants={!reducedMotion ? textRevealVariants : undefined}
      initial="hidden"
      animate="visible"
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

// Pokemon-style list with staggered animations
interface PokemonListProps {
  items: Array<{
    id: string;
    content: ReactNode;
    onClick?: () => void;
  }>;
  className?: string;
  reducedMotion?: boolean;
}

export const PokemonList: React.FC<PokemonListProps> = ({
  items,
  className = '',
  reducedMotion: externalReducedMotion,
}) => {
  const internalReducedMotion = useReducedMotion();
  const reducedMotion = externalReducedMotion ?? internalReducedMotion;

  return (
    <motion.div
      className={className}
      variants={!reducedMotion ? staggerContainer : undefined}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          variants={!reducedMotion ? staggerItem : undefined}
          custom={index}
          className="mb-2"
        >
          <PokemonCard onClick={item.onClick}>{item.content}</PokemonCard>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Pokemon-style notification/toast
interface PokemonNotificationProps {
  children: ReactNode;
  isVisible: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  className?: string;
}

export const PokemonNotification: React.FC<PokemonNotificationProps> = ({
  children,
  isVisible,
  type = 'info',
  onClose,
  autoClose = false,
  duration = 3000,
  className = '',
}) => {
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, isVisible, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-700';
      case 'warning':
        return 'bg-yellow-500 text-black border-yellow-700';
      case 'error':
        return 'bg-red-500 text-white border-red-700';
      default:
        return 'bg-blue-500 text-white border-blue-700';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`
            fixed top-4 right-4 z-50 p-4 border-2 rounded-lg shadow-lg
            ${getTypeStyles()}
            ${className}
          `}
          variants={notificationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            boxShadow: `
              inset -2px -2px 0px 0px rgba(0,0,0,0.2),
              inset 2px 2px 0px 0px rgba(255,255,255,0.2)
            `,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="mr-4">{children}</div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Close notification"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Pokemon-style progress bar
interface PokemonProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
}

export const PokemonProgressBar: React.FC<PokemonProgressBarProps> = ({
  value,
  max = 100,
  color = POKEMON_COLORS.green,
  className = '',
  showLabel = true,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <div className="text-sm font-bold mb-1">
          {value}/{max}
        </div>
      )}
      <div className="w-full bg-gray-300 border-2 border-black rounded">
        <motion.div
          className="h-4 rounded border-2 border-black"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: POKEMON_TIMING.normal / 1000,
            ease: POKEMON_EASING.expoOut,
          }}
        />
      </div>
    </div>
  );
};

// Pokemon-style floating action button
interface PokemonFabProps {
  children: ReactNode;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: string;
  className?: string;
}

export const PokemonFab: React.FC<PokemonFabProps> = ({
  children,
  onClick,
  position = 'bottom-right',
  color = POKEMON_COLORS.blue,
  className = '',
}) => {
  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <motion.button
      className={`
        fixed z-50 w-14 h-14 rounded-full border-2 border-black shadow-lg
        flex items-center justify-center text-white font-bold
        ${getPositionStyles()}
        ${className}
      `}
      style={{ backgroundColor: color }}
      whileHover={{
        scale: 1.1,
        transition: {
          duration: POKEMON_TIMING.fast / 1000,
          ease: POKEMON_EASING.snappy,
        },
      }}
      whileTap={{
        scale: 0.9,
        transition: {
          duration: 50 / 1000,
          ease: POKEMON_EASING.snappy,
        },
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};
