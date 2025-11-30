// ABOUTME: Layout for dark agency-style graduation invitation
// ABOUTME: Sets metadata with i18n and loads Oswald + Manrope fonts

import type { Metadata } from 'next';
import { Oswald, Manrope } from 'next/font/google';
import { translations } from './config/translations';

const oswald = Oswald({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
});

// Default to Vietnamese for SEO (primary audience)
const defaultLocale = 'vi';
const t = translations[defaultLocale];

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  openGraph: {
    title: t.metaTitle,
    description: t.metaOgDescription,
    type: 'website',
    locale: 'vi_VN',
    alternateLocale: 'en_US',
    images: [
      {
        url: '/og-graduation.jpg',
        width: 1456,
        height: 816,
        alt: 'Lễ Tốt Nghiệp - Nguyễn Công Khanh',
      },
    ],
  },
  alternates: {
    languages: {
      vi: '/graduation',
      en: '/graduation?lang=en',
    },
  },
};

export default function GraduationSingleLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${oswald.variable} ${manrope.variable}`}>{children}</div>;
}
