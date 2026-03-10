export interface ExperienceEntry {
  id: string;
  period: string;
  title: string;
  company: string;
  bullets: string[];
}

export interface StackData {
  languages: string[];
  frontend: string[];
  backend: string[];
  data: string[];
  infra: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  type: string;
  description: string;
  tech: string[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  period: string;
  gpa?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  location: string;
  contact: {
    github: string;
    linkedin: string;
    email: string;
  };
  overview: string;
  experience: ExperienceEntry[];
  stack: StackData;
  projects: ProjectEntry[];
  education: EducationEntry[];
}

export const NAV_SECTIONS = ["OVERVIEW", "EXPERIENCE", "STACK", "PROJECTS", "EDUCATION"] as const;

export type NavSection = (typeof NAV_SECTIONS)[number];
