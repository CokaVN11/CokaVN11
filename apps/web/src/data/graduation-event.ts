// ABOUTME: Configuration file for the graduation invitation page
// ABOUTME: Contains all event details, venue info, and RSVP settings

export interface GraduationEventConfig {
  graduate: {
    fullName: string;
    degree: string;
    school: string;
  };
  event: {
    title: string;
    dateISO: string;
    startTime: string;
    endTime: string | null;
    timezone: string;
  };
  venue: {
    name: string;
    addressLine: string;
    mapsQuery: string;
    parkingNote: string;
  };
  rsvp: {
    provider: 'formspree';
    formspreeId: string;
    deadlineISO: string | null;
  };
  contacts: Array<{
    label: string;
    href: string;
    icon: string;
  }>;
  gallery: Array<{
    src: string;
    alt: string;
  }>;
}

export const eventConfig: GraduationEventConfig = {
  graduate: {
    fullName: 'Nguyễn Công Khanh',
    degree: 'Bachelor of Information Technology',
    school: 'University of Science – VNUHCM – Hồ Chí Minh',
  },
  event: {
    title: 'Graduation Day',
    dateISO: '2025-12-06',
    startTime: '10:00',
    endTime: null,
    timezone: 'Asia/Ho_Chi_Minh',
  },
  venue: {
    name: 'University of Science – VNUHCM',
    addressLine: '227 Nguyễn Văn Cừ, P. Chợ Quán, TP. Hồ Chí Minh',
    mapsQuery: '227 Nguyễn Văn Cừ Phường Chợ Quán TP Hồ Chí Minh',
    parkingNote: 'Nên gửi xe ngoài trường hoặc đi Grab cho tiện nhé!',
  },
  rsvp: {
    provider: 'formspree',
    formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID || '',
    deadlineISO: null,
  },
  contacts: [
    // Add contact links later
    // { label: 'Zalo', href: 'https://zalo.me/xxxx', icon: 'zalo' }
  ],
  gallery: [
    // Add polaroid images later
    // { src: '/images/p1.webp', alt: 'Campus' }
  ],
};
