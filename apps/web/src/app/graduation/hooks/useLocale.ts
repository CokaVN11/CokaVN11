// ABOUTME: Hook for detecting and managing locale preference
// ABOUTME: Returns locale, translations, and date-fns locale for datetime formatting

'use client';

import { useState, useEffect, useMemo } from 'react';
import { vi, enUS } from 'date-fns/locale';
import type { Locale as DateFnsLocale } from 'date-fns';
import { type Locale, type Translations, translations, interpolate } from '../config/translations';

interface UseLocaleResult {
  /** Current locale code */
  locale: Locale;
  /** Translations object for current locale */
  t: Translations;
  /** date-fns locale object for datetime formatting */
  dateFnsLocale: DateFnsLocale;
  /** Timezone string for the event (Asia/Ho_Chi_Minh) */
  timezone: string;
  /** Helper to interpolate variables in translation strings */
  interpolate: (template: string, variables: Record<string, string | number>) => string;
  /** Set locale manually (overrides browser detection) */
  setLocale: (locale: Locale) => void;
}

const DATE_FNS_LOCALES: Record<Locale, DateFnsLocale> = {
  en: enUS,
  vi: vi,
};

const EVENT_TIMEZONE = 'Asia/Ho_Chi_Minh';

/**
 * Detect browser language and return matching locale
 */
function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'vi';

  const browserLang = navigator.language || navigator.languages?.[0] || 'vi';
  const langCode = browserLang.split('-')[0].toLowerCase();

  // Check URL parameter first (allows sharing links with specific locale)
  const urlParams = new URLSearchParams(window.location.search);
  const urlLocale = urlParams.get('lang');
  if (urlLocale === 'en' || urlLocale === 'vi') {
    return urlLocale;
  }

  // Default to Vietnamese (URL param ?lang=en still works for English)
  return 'vi';
}

/**
 * Hook for managing locale and translations
 *
 * Usage:
 * ```tsx
 * const { t, dateFnsLocale, interpolate } = useLocale();
 * const formattedDate = format(date, t.dateFormat, { locale: dateFnsLocale });
 * const message = interpolate(t.joinUsCelebrating, { name: "Khanh" });
 * ```
 */
export function useLocale(): UseLocaleResult {
  const [locale, setLocale] = useState<Locale>('vi');
  const [isClient, setIsClient] = useState(false);

  // Detect locale on client-side mount
  useEffect(() => {
    setIsClient(true);
    const detected = detectBrowserLocale();
    setLocale(detected);
  }, []);

  // Memoize derived values
  const result = useMemo(
    (): UseLocaleResult => ({
      locale,
      t: translations[locale],
      dateFnsLocale: DATE_FNS_LOCALES[locale],
      timezone: EVENT_TIMEZONE,
      interpolate,
      setLocale,
    }),
    [locale]
  );

  return result;
}

/**
 * Get static locale for server-side rendering
 * Defaults to Vietnamese
 */
export function getStaticLocale(locale: Locale = 'vi'): UseLocaleResult {
  return {
    locale,
    t: translations[locale],
    dateFnsLocale: DATE_FNS_LOCALES[locale],
    timezone: EVENT_TIMEZONE,
    interpolate,
    setLocale: () => {},
  };
}
