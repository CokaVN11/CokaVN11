// ABOUTME: Accessible accordion component for FAQ section
// ABOUTME: Uses ARIA attributes and keyboard navigation for accessibility

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AccordionItem {
  q: string;
  a: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, className = '' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleItem(index);
    }
  };

  // Validate items length (max 8 as per spec)
  const validItems = items.slice(0, 8);

  return (
    <div className={`space-y-4 ${className}`}>
      {validItems.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border-2 border-graduation-muted rounded-2xl overflow-hidden bg-graduation-card"
          >
            <button
              onClick={() => toggleItem(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${index}`}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-graduation-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-graduation-primary focus:ring-inset"
            >
              <span className="font-medium text-graduation-text text-lg">{item.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 ml-4"
              >
                <svg
                  className="w-5 h-5 text-graduation-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${index}`}
                  role="region"
                  aria-labelledby={`accordion-button-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-graduation-text/80">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
