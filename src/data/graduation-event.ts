// ABOUTME: Configuration file for the graduation invitation page
// ABOUTME: Contains all event details and venue information

export interface GraduationEventConfig {
  graduate: {
    fullName: string;
    firstName: string;
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
}

export const eventConfig: GraduationEventConfig = {
  graduate: {
    fullName: 'Nguyễn Công Khanh',
    firstName: 'Khanh',
    degree: 'Bachelor of Information Technology',
    school: 'University of Science – VNUHCM – Hồ Chí Minh',
  },
  event: {
    title: 'Graduation Day',
    dateISO: '2025-12-06',
    startTime: '10:00',
    endTime: '12:00',
    timezone: 'Asia/Ho_Chi_Minh',
  },
  venue: {
    name: 'University of Science – VNUHCM',
    addressLine: '227 Nguyễn Văn Cừ, P. Chợ Quán, TP. Hồ Chí Minh',
    mapsQuery: '227 Nguyễn Văn Cừ Phường Chợ Quán TP Hồ Chí Minh',
    parkingNote: 'Nên gửi xe ngoài trường hoặc đi Grab cho tiện nhé!',
  },
};
