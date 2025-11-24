// ABOUTME: Layout for graduation invitation page with metadata and font loading
// ABOUTME: Sets up proper SEO, accessibility, and loads display fonts

import { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Lễ Tốt Nghiệp - Nguyễn Công Khanh | Graduation Day 2025',
  description:
    'Tham gia cùng tôi trong buổi lễ trao bằng tốt nghiệp ngành Công nghệ Thông tin tại Trường Đại học Khoa học Tự nhiên TP.HCM vào ngày 06/12/2025.',
  keywords: [
    'graduation',
    'tốt nghiệp',
    'VNUHCM',
    'University of Science',
    'Information Technology',
    'Nguyễn Công Khanh',
  ],
  authors: [{ name: 'Nguyễn Công Khanh' }],
  openGraph: {
    title: 'Lễ Tốt Nghiệp - Nguyễn Công Khanh',
    description: 'Mời bạn tham dự buổi lễ trao bằng tốt nghiệp ngày 06/12/2025',
    type: 'website',
    locale: 'vi_VN',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5, // Allow zoom for accessibility
  },
};

export default function GraduationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${playfairDisplay.variable} ${inter.variable} font-body`}
      lang="vi"
    >
      {children}
    </div>
  );
}
