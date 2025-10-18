'use client';

import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import {
  panelVariants,
  POKEMON_TIMING,
  POKEMON_EASING,
  POKEMON_COLORS,
  useReducedMotion,
  createAnimationProps,
} from './pokemon-motion';

interface PokemonPanelProps extends MotionProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
  overlay?: boolean;
  reducedMotion?: boolean;
}

export const PokemonPanel: React.FC<PokemonPanelProps> = ({
  children,
  isOpen,
  onClose,
  position = 'left',
  className = '',
  overlay = true,
  reducedMotion: externalReducedMotion,
  ...motionProps
}) => {
  const internalReducedMotion = useReducedMotion();
  const reducedMotion = externalReducedMotion ?? internalReducedMotion;

  // Position-specific variants
  const getPositionVariants = () => {
    const baseVariants = { ...panelVariants };

    switch (position) {
      case 'right':
        return {
          hidden: { ...baseVariants.hidden, x: '100%' },
          visible: { ...baseVariants.visible },
          exit: { ...baseVariants.exit, x: '100%' },
        };
      case 'top':
        return {
          hidden: { ...baseVariants.hidden, y: '-100%', x: 0 },
          visible: { ...baseVariants.visible, y: 0, x: 0 },
          exit: { ...baseVariants.exit, y: '-100%', x: 0 },
        };
      case 'bottom':
        return {
          hidden: { ...baseVariants.hidden, y: '100%', x: 0 },
          visible: { ...baseVariants.visible, y: 0, x: 0 },
          exit: { ...baseVariants.exit, y: '100%', x: 0 },
        };
      default:
        return baseVariants;
    }
  };

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const animationProps = createAnimationProps(
    POKEMON_TIMING.normal,
    POKEMON_EASING.expoOut,
    reducedMotion
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {overlay && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: POKEMON_TIMING.fast / 1000 }}
              onClick={onClose}
            />
          )}
          <motion.div
            className={`
              fixed z-50 bg-white shadow-2xl
              ${position === 'left' ? 'left-0 top-0 h-full w-80' : ''}
              ${position === 'right' ? 'right-0 top-0 h-full w-80' : ''}
              ${position === 'top' ? 'left-0 top-0 w-full h-80' : ''}
              ${position === 'bottom' ? 'left-0 bottom-0 w-full h-80' : ''}
              ${className}
            `}
            variants={getPositionVariants()}
            initial="hidden"
            animate="visible"
            exit="exit"
            {...animationProps}
            {...motionProps}
          >
            {/* Pokemon-style panel header */}
            <div
              className="relative bg-gradient-to-r from-red-500 to-blue-500 p-4 border-b-4 border-black"
              style={{
                background: `linear-gradient(90deg, ${POKEMON_COLORS.red}, ${POKEMON_COLORS.blue})`,
              }}
            >
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <h2 className="relative text-white font-bold text-lg pixel-font">MENU</h2>
              {onClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center text-black font-bold hover:bg-gray-200 transition-colors"
                  aria-label="Close panel"
                >
                  ×
                </button>
              )}
            </div>

            {/* Panel content with Pokemon-style styling */}
            <div className="p-6 bg-white h-full overflow-y-auto">{children}</div>

            {/* Pokemon-style pixel border effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `
                  inset -4px -4px 0px 0px rgba(0,0,0,0.1),
                  inset 4px 4px 0px 0px rgba(255,255,255,0.1)
                `,
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Pokemon-style menu item component
interface PokemonMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  className?: string;
}

export const PokemonMenuItem: React.FC<PokemonMenuItemProps> = ({
  children,
  onClick,
  isSelected = false,
  disabled = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`
        w-full p-4 text-left font-bold border-2 border-black transition-all
        ${isSelected ? 'bg-blue-500 text-white' : 'bg-white text-black'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${!disabled && !isSelected && isHovered ? 'bg-gray-100' : ''}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{
        duration: POKEMON_TIMING.fast / 1000,
        ease: POKEMON_EASING.snappy,
      }}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
    >
      <div className="flex items-center justify-between">
        <span>{children}</span>
        {isSelected && (
          <motion.div
            className="w-4 h-4 bg-yellow-400 border-2 border-black"
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </div>
    </motion.button>
  );
};

// Pokemon-style navigation component
interface PokemonNavProps {
  items: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }>;
  selectedId?: string;
  className?: string;
}

export const PokemonNav: React.FC<PokemonNavProps> = ({ items, selectedId, className = '' }) => {
  return (
    <nav className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: POKEMON_TIMING.fast / 1000,
            delay: (index * 50) / 1000,
            ease: POKEMON_EASING.snappy,
          }}
        >
          <PokemonMenuItem
            isSelected={selectedId === item.id}
            onClick={item.onClick}
            disabled={item.disabled}
          >
            <div className="flex items-center space-x-3">
              {item.icon && <span className="text-xl">{item.icon}</span>}
              <span>{item.label}</span>
            </div>
          </PokemonMenuItem>
        </motion.div>
      ))}
    </nav>
  );
};
