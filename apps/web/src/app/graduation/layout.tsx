// ABOUTME: Layout for dark agency-style graduation invitation
// ABOUTME: Sets metadata and loads Oswald + Manrope fonts

import type { Metadata } from 'next';
import { Oswald, Manrope } from 'next/font/google';

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

export const metadata: Metadata = {
  title: 'Nguyễn Công Khanh - Graduation Ceremony',
  description: 'Join us in celebrating Khanh\'s graduation from the University of Science - VNUHCM. June 12, 2025 at 10:00 AM.',
  openGraph: {
    title: 'Nguyễn Công Khanh - Graduation Ceremony',
    description: 'Join us in celebrating this milestone achievement',
    type: 'website',
  },
};

export default function GraduationSingleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${oswald.variable} ${manrope.variable}`}>
      {children}
    </div>
  );
}
