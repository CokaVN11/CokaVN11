// ABOUTME: Calendar utility functions for generating calendar links and ICS files
// ABOUTME: Supports Google Calendar deep links and downloadable ICS format

import { GraduationEventConfig } from '@/data/graduation-event';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/**
 * Converts a local date/time to UTC format for calendar APIs
 */
function toUTCString(dateISO: string, time: string, timezone: string): string {
  const [hours, minutes] = time.split(':');
  const localDate = new Date(dateISO);
  localDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

  // Convert to UTC
  const zonedDate = toZonedTime(localDate, timezone);
  return format(zonedDate, "yyyyMMdd'T'HHmmss'Z'");
}

/**
 * Generates a Google Calendar link for the graduation event
 */
export function generateGoogleCalendarLink(config: GraduationEventConfig): string {
  const { graduate, event, venue } = config;

  const startTime = toUTCString(event.dateISO, event.startTime, event.timezone);

  // Default to 2 hours if no end time specified
  const endDate = new Date(event.dateISO);
  const [hours, minutes] = event.startTime.split(':');
  endDate.setHours(parseInt(hours, 10) + 2, parseInt(minutes, 10), 0, 0);
  const endTime = format(endDate, "yyyyMMdd'T'HHmmss'Z'");

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.title} – ${graduate.fullName}`,
    dates: `${startTime}/${endTime}`,
    location: venue.addressLine,
    details: `${graduate.degree}\n\n${venue.parkingNote}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates an ICS file content for download
 */
export function generateICSFile(config: GraduationEventConfig): string {
  const { graduate, event, venue } = config;

  const startTime = toUTCString(event.dateISO, event.startTime, event.timezone);

  // Default to 2 hours if no end time specified
  const endDate = new Date(event.dateISO);
  const [hours, minutes] = event.startTime.split(':');
  endDate.setHours(parseInt(hours, 10) + 2, parseInt(minutes, 10), 0, 0);
  const endTime = format(endDate, "yyyyMMdd'T'HHmmss'Z'");

  const now = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Graduation Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${startTime}`,
    `DTEND:${endTime}`,
    `DTSTAMP:${now}`,
    `SUMMARY:${event.title} – ${graduate.fullName}`,
    `DESCRIPTION:${graduate.degree}\\n\\n${venue.parkingNote}`,
    `LOCATION:${venue.addressLine}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return ics;
}

/**
 * Creates a data URL for ICS file download
 */
export function getICSDownloadLink(config: GraduationEventConfig): string {
  const icsContent = generateICSFile(config);
  return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
}
