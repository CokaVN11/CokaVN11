// ABOUTME: Custom button component for graduation invitation page
// ABOUTME: Supports primary, secondary, and ghost variants with hover animations

'use client';

import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  iconLeft?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'primary',
  iconLeft,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-2xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-graduation-primary text-white hover:bg-graduation-primary/90 focus:ring-graduation-primary shadow-md',
    secondary:
      'bg-graduation-accent text-graduation-text hover:bg-graduation-accent/80 focus:ring-graduation-accent shadow-sm',
    ghost:
      'bg-transparent text-graduation-primary border-2 border-graduation-primary hover:bg-graduation-primary hover:text-white focus:ring-graduation-primary',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={combinedClassName}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
    >
      {content}
    </motion.button>
  );
};
