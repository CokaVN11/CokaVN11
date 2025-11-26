// ABOUTME: Add-to-calendar button with dropdown for Google Calendar, ICS, and Outlook
// ABOUTME: Premium gradient design with buttery 60fps micro-interactions

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DURATION,
  DURATION_60FPS,
  SPRING_60FPS,
  TRANSFORM_60FPS,
  STAGGER_60FPS,
  EASING_60FPS,
} from '../config/animations';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { format } from 'date-fns';

interface AddToCalendarButtonProps {
  eventConfig: any;
}

export function AddToCalendarButton({ eventConfig }: AddToCalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { event, venue, graduate } = eventConfig;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Generate calendar links
  const generateGoogleCalendarLink = () => {
    const eventDate = new Date(event.dateISO);
    const startDateTime = `${format(eventDate, 'yyyyMMdd')}T${event.startTime.replace(':', '')}00`;
    const endDateTime = `${format(eventDate, 'yyyyMMdd')}T130000`; // 1:00 PM end time

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${graduate.fullName} - Graduation Ceremony`,
      dates: `${startDateTime}/${endDateTime}`,
      location: venue.addressLine,
      details: `Join us in celebrating ${graduate.firstName}'s graduation!`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const generateICSContent = () => {
    const eventDate = new Date(event.dateISO);
    const startDateTime = format(eventDate, "yyyyMMdd'T'HHmmss");

    return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDateTime}
SUMMARY:${graduate.fullName} - Graduation Ceremony
LOCATION:${venue.addressLine}
DESCRIPTION:Join us in celebrating ${graduate.firstName}'s graduation!
END:VEVENT
END:VCALENDAR`;
  };

  const handleDownloadICS = () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'graduation-ceremony.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  const calendarOptions = [
    {
      icon: '📅',
      label: 'Google Calendar',
      action: () => {
        window.open(generateGoogleCalendarLink(), '_blank');
        setIsOpen(false);
      },
    },
    {
      icon: '📥',
      label: 'Download ICS',
      action: handleDownloadICS,
    },
    {
      icon: '🌐',
      label: 'Outlook Web',
      action: () => {
        window.open(generateGoogleCalendarLink().replace('google.com', 'outlook.live.com'), '_blank');
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        className="flex items-center justify-center gap-2 w-full max-w-[320px] md:w-[200px] md:max-w-none h-12 md:h-14 rounded-28 bg-gradient-blue shadow-button-blue border-none cursor-pointer font-body text-base font-semibold tracking-[0.02em] text-white transition-shadow duration-300 ease-[cubic-bezier(0.445,0.05,0.55,0.95)] hover:shadow-button-blue-hover active:shadow-button-blue-active focus-visible:outline focus-visible:outline-3 focus-visible:outline-grad-single-blue-primary focus-visible:outline-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        // 60fps button press with lift
        whileHover={
          shouldReduceMotion
            ? { opacity: 0.9 }
            : {
                scale: 1.02,
                y: TRANSFORM_60FPS.hoverLiftY,
              }
        }
        whileTap={
          shouldReduceMotion
            ? { opacity: 0.8 }
            : {
                scale: TRANSFORM_60FPS.pressScale,
                y: 0,
              }
        }
        transition={{ duration: DURATION_60FPS.micro, ease: EASING_60FPS.easeOutEmphasized as any }}
      >
        <span className="text-xl">📅</span>
        <span className="flex-1">Add to Calendar</span>
        <motion.span
          className="text-xs inline-block"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: DURATION.fast }}
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-full max-w-[320px] md:w-[220px] md:max-w-none bg-grad-single-bg-dropdown border border-grad-single-glass-10 rounded-2xl shadow-dropdown p-2 z-[100]"
            // 60fps spatial dropdown with spring physics
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={shouldReduceMotion ? { duration: DURATION_60FPS.short } : SPRING_60FPS.dropdownExpand}
          >
            {calendarOptions.map((option, index) => (
              <motion.button
                key={option.label}
                className="flex items-center gap-3 w-full p-3 rounded-xl bg-transparent border-none font-body text-sm font-medium text-grad-single-text text-left cursor-pointer transition-all duration-150 ease-in-out hover:bg-grad-single-glass-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-grad-single-blue-primary focus-visible:-outline-offset-2"
                onClick={option.action}
                // 60fps staggered menu items with micro hover
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: DURATION_60FPS.micro,
                  delay: index * STAGGER_60FPS.menuItems,
                  ease: EASING_60FPS.easeOutSoft as any,
                }}
                whileHover={
                  shouldReduceMotion
                    ? { opacity: 0.9 }
                    : {
                        x: 4,
                      }
                }
                whileTap={
                  shouldReduceMotion
                    ? { opacity: 0.8 }
                    : {
                        scale: TRANSFORM_60FPS.pressScale,
                      }
                }
              >
                <span className="text-xl flex-shrink-0">{option.icon}</span>
                <span className="flex-1">{option.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
