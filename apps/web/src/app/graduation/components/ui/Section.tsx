// ABOUTME: Reusable section wrapper component for graduation page
// ABOUTME: Provides consistent spacing and optional titles for content sections

import React from 'react';

interface SectionProps {
  id?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ id, title, children, className = '' }) => {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto ${className}`}
    >
      {title && (
        <h2 className="text-3xl md:text-4xl font-display text-graduation-text text-center mb-12">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
};
