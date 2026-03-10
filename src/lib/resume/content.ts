import type { ResumeData } from "./types";

export const RESUME: ResumeData = {
  name: "COKA",
  title: "SOFTWARE ENGINEER",
  location: "EARTH",
  contact: {
    github: "https://github.com/coka",
    linkedin: "https://linkedin.com/in/coka",
    email: "hello@coka.dev",
  },
  overview:
    "FULL-STACK ENGINEER WITH A PASSION FOR BUILDING GREAT PRODUCTS. " +
    "EXPERIENCED IN TYPESCRIPT, REACT, AND CLOUD INFRASTRUCTURE. " +
    "CURRENTLY EXPLORING THE INTERSECTION OF DESIGN AND ENGINEERING.",
  experience: [
    {
      id: "exp-01",
      period: "2023 – PRESENT",
      title: "SENIOR SOFTWARE ENGINEER",
      company: "ACME CORP",
      bullets: [
        "BUILT AND SHIPPED PRODUCT FEATURES USED BY 100K+ USERS",
        "LED ARCHITECTURE DECISIONS FOR CORE PLATFORM SERVICES",
        "MENTORED JUNIOR ENGINEERS AND DROVE CODE QUALITY INITIATIVES",
      ],
    },
    {
      id: "exp-02",
      period: "2021 – 2023",
      title: "SOFTWARE ENGINEER",
      company: "STARTUP INC",
      bullets: [
        "DEVELOPED FULL-STACK FEATURES IN REACT AND NODE.JS",
        "REDUCED API LATENCY BY 40% THROUGH QUERY OPTIMIZATION",
        "CONTRIBUTED TO DESIGN SYSTEM USED ACROSS 5 PRODUCTS",
      ],
    },
  ],
  stack: {
    languages: ["TYPESCRIPT", "PYTHON", "GO", "SQL"],
    frontend: ["REACT", "ASTRO", "NEXT.JS", "TAILWIND CSS"],
    backend: ["NODE.JS", "FASTAPI", "POSTGRESQL", "REDIS"],
    data: ["PANDAS", "DUCKDB", "BIGQUERY"],
    infra: ["AWS", "TERRAFORM", "DOCKER", "GITHUB ACTIONS"],
  },
  projects: [
    {
      id: "proj-01",
      name: "Coka Portfolio",
      type: "SIDE PROJECT",
      description:
        "RETRO ARCADE PORTFOLIO — A BREAKOUT GAME WHERE BREAKING BRICKS REVEALS CV SECTIONS.",
      tech: ["ASTRO", "REACT", "TYPESCRIPT", "CANVAS 2D"],
    },
    {
      id: "proj-02",
      name: "OPEN SOURCE TOOL",
      type: "OSS",
      description: "A DEVELOPER TOOL THAT DOES SOMETHING USEFUL.",
      tech: ["TYPESCRIPT", "NODE.JS"],
    },
  ],
  education: [
    {
      degree: "B.SC. COMPUTER SCIENCE",
      school: "UNIVERSITY OF SOMEWHERE",
      period: "2017 – 2021",
      gpa: "3.8 / 4.0",
    },
  ],
};
