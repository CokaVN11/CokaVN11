// ABOUTME: Translations for the graduation invitation page
// ABOUTME: Supports English (en) and Vietnamese (vi) locales

export type Locale = 'en' | 'vi';

export interface Translations {
  // Accessibility
  skipToMainContent: string;
  loadingGraduationInvitation: string;
  heroVisual: string;
  eventInformation: string;

  // Loading screen
  loading: string;

  // Info grid labels
  date: string;
  time: string;
  location: string;
  startTime: string;
  morningIndicator: string;

  // CTA buttons
  addToCalendar: string;
  getDirections: string;

  // Calendar options
  googleCalendar: string;
  downloadICS: string;
  outlookWeb: string;

  // Calendar event content
  graduationCeremony: string;
  joinUsCelebrating: string;

  // Marquee
  classOf: string;

  // Parking note
  parkingNote: string;

  // Info grid actions
  tapToOpenMaps: string;
  openInMapsAriaLabel: string;

  // Invitation quote (personalized)
  invitationQuoteLine1: string;
  invitationQuoteLine2: string;

  // Metadata
  metaTitle: string;
  metaDescription: string;
  metaOgDescription: string;

  // Date formatting
  dateFormat: string;
  dayFormat: string;
}

export const translations: Record<Locale, Translations> = {
  en: {
    // Accessibility
    skipToMainContent: 'Skip to main content',
    loadingGraduationInvitation: 'Loading graduation invitation',
    heroVisual: 'Hero visual',
    eventInformation: 'Event information',

    // Loading screen
    loading: 'Loading',

    // Info grid labels
    date: 'Date',
    time: 'Time',
    location: 'Location',
    startTime: 'Start time',
    morningIndicator: 'AM',

    // CTA buttons
    addToCalendar: 'Add to Calendar',
    getDirections: 'Get Directions',

    // Calendar options
    googleCalendar: 'Google Calendar',
    downloadICS: 'Download ICS',
    outlookWeb: 'Outlook Web',

    // Calendar event content
    graduationCeremony: 'Graduation Ceremony',
    joinUsCelebrating: "Join us in celebrating {name}'s graduation!",

    // Marquee
    classOf: 'Class of {year}',

    // Parking note
    parkingNote: 'We recommend parking outside the campus or taking a Grab for convenience!',

    // Info grid actions
    tapToOpenMaps: 'Open in Maps',
    openInMapsAriaLabel: 'Open location in Google Maps',

    // Invitation quote (personalized)
    invitationQuoteLine1: 'Dear {guestName},',
    invitationQuoteLine2: 'it would mean so much to have you there.',

    // Metadata
    metaTitle: 'Nguyễn Công Khanh - Graduation Ceremony',
    metaDescription:
      "Join us in celebrating Khanh's graduation from the University of Science - VNUHCM.",
    metaOgDescription: 'Join us in celebrating this milestone achievement',

    // Date formatting (date-fns format strings)
    dateFormat: 'dd MMM yyyy',
    dayFormat: 'EEEE',
  },
  vi: {
    // Accessibility
    skipToMainContent: 'Chuyển đến nội dung chính',
    loadingGraduationInvitation: 'Đang tải thiệp mời tốt nghiệp',
    heroVisual: 'Hình ảnh chính',
    eventInformation: 'Thông tin sự kiện',

    // Loading screen
    loading: 'Đang tải',

    // Info grid labels
    date: 'Ngày',
    time: 'Giờ',
    location: 'Địa điểm',
    startTime: 'Giờ bắt đầu',
    morningIndicator: 'sáng',

    // CTA buttons
    addToCalendar: 'Thêm vào lịch',
    getDirections: 'Chỉ đường',

    // Calendar options
    googleCalendar: 'Google Calendar',
    downloadICS: 'Tải file ICS',
    outlookWeb: 'Outlook Web',

    // Calendar event content
    graduationCeremony: 'Lễ Tốt Nghiệp',
    joinUsCelebrating: 'Mời bạn đến chung vui cùng {name}!',

    // Marquee
    classOf: 'Khóa {year}',

    // Parking note
    parkingNote: 'Nên gửi xe ngoài trường hoặc đi Grab cho tiện nhé!',

    // Info grid actions
    tapToOpenMaps: 'Mở bản đồ',
    openInMapsAriaLabel: 'Mở vị trí trong Google Maps',

    // Invitation quote (personalized)
    invitationQuoteLine1: 'Thân mời {guestName},',
    invitationQuoteLine2: 'đến chung vui với mình.',

    // Metadata
    metaTitle: 'Nguyễn Công Khanh - Lễ Tốt Nghiệp',
    metaDescription:
      'Mời bạn đến chung vui trong Lễ Tốt Nghiệp của Khanh tại Trường Đại học Khoa học Tự nhiên - ĐHQG-HCM.',
    metaOgDescription: 'Mời bạn đến chung vui trong ngày trọng đại này',

    // Date formatting (date-fns format strings)
    dateFormat: "'Ngày' dd 'tháng' MM 'năm' yyyy",
    dayFormat: 'EEEE',
  },
};

/**
 * Helper function to interpolate variables in translation strings
 * Example: interpolate("Hello {name}!", { name: "World" }) => "Hello World!"
 */
export function interpolate(template: string, variables: Record<string, string | number>): string {
  return template.replace(/{(\w+)}/g, (_, key) => String(variables[key] ?? ''));
}
