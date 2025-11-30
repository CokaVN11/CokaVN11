// ABOUTME: Add-to-calendar button with dropdown for Google Calendar and ICS download
// ABOUTME: Minimal ghost style with aurora glow, i18n support and 60fps micro-interactions

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Download } from 'lucide-react';
import {
  DURATION,
  DURATION_60FPS,
  SPRING_60FPS,
  TRANSFORM_60FPS,
  STAGGER_60FPS,
  EASING_60FPS,
} from '../config/animations';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLocale } from '../hooks/useLocale';
import { format } from 'date-fns';

interface AddToCalendarButtonProps {
  eventConfig: any;
}

export function AddToCalendarButton({ eventConfig }: AddToCalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { t, interpolate } = useLocale();

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

  // Generate translated event title and description
  const eventTitle = `${graduate.fullName} - ${t.graduationCeremony}`;
  const eventDescription = interpolate(t.joinUsCelebrating, {
    name: graduate.firstName,
  });

  // Generate calendar links
  const generateGoogleCalendarLink = () => {
    const eventDate = new Date(event.dateISO);
    const startDateTime = `${format(eventDate, 'yyyyMMdd')}T${event.startTime.replace(':', '')}00`;
    const endDateTime = `${format(eventDate, 'yyyyMMdd')}T130000`; // 1:00 PM end time

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: eventTitle,
      dates: `${startDateTime}/${endDateTime}`,
      location: venue.addressLine,
      details: eventDescription,
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
SUMMARY:${eventTitle}
LOCATION:${venue.addressLine}
DESCRIPTION:${eventDescription}
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

  const calendarOptions: Array<{
    icon: React.ReactNode;
    label: string;
    action: () => void;
  }> = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: t.googleCalendar,
      action: () => {
        window.open(generateGoogleCalendarLink(), '_blank');
        setIsOpen(false);
      },
    },
    {
      icon: <Download className="w-5 h-5" />,
      label: t.downloadICS,
      action: handleDownloadICS,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        data-cursor-magnetic
        className="flex items-center px-4 justify-center gap-2 w-full max-w-[320px] md:w-[200px] md:max-w-none h-12 md:h-14 rounded-28 bg-transparent border border-white/10 cursor-pointer font-body text-base font-medium text-white/80 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.03] hover:shadow-[0_0_60px_-15px_rgba(217,64,140,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50 focus-visible:outline-offset-2"
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
        <Calendar className="w-5 h-5" />
        <span className="flex-1">{t.addToCalendar}</span>
        <motion.span
          className="inline-block text-xs"
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
            transition={
              shouldReduceMotion ? { duration: DURATION_60FPS.short } : SPRING_60FPS.dropdownExpand
            }
          >
            {calendarOptions.map((option, index) => (
              <motion.button
                key={option.label}
                className="flex items-center gap-3 w-full p-3 rounded-xl bg-transparent border-none font-body text-sm font-medium text-white/80 text-left cursor-pointer transition-all duration-300 hover:bg-white/[0.05] hover:shadow-[0_0_40px_-10px_rgba(217,64,140,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50 focus-visible:-outline-offset-2"
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
                <span className="flex-shrink-0 text-white/70">{option.icon}</span>
                <span className="flex-1">{option.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
