import { useCallback, useEffect, useRef, useState } from "react";
import { RESUME } from "@/lib/resume/content";
import { NAV_SECTIONS, type NavSection } from "@/lib/resume/types";
import { TopBar } from "../TopBar";
import { Footer } from "../Footer";
import { Sidebar } from "./Sidebar";
import { IdentityHeader } from "./IdentityHeader";
import { OverviewSection } from "./OverviewSection";
import { ExperienceSection } from "./ExperienceSection";
import { StackSection } from "./StackSection";
import { ProjectsSection } from "./ProjectsSection";
import { EducationSection } from "./EducationSection";

// All RESUME derivations hoisted to module level — computed once, not per render
const IDENTITY_CONTACTS = Object.entries(RESUME.contact).map(
  ([key, value]) => ({
    key,
    href: value.startsWith("http") ? value : `mailto:${value}`,
  }),
);

interface CVListProps {
  initialSection?: NavSection;
  onBack: () => void;
}

export function CVList({ initialSection = "OVERVIEW", onBack }: CVListProps) {
  const [activeSection, setActiveSection] =
    useState<NavSection>(initialSection);
  const [cursorIdle, setCursorIdle] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onBackRef = useRef(onBack);

  useEffect(() => {
    onBackRef.current = onBack;
  });

  const resetIdleTimer = useCallback(() => {
    setCursorIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setCursorIdle(true), 2000);
  }, []);

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const navigate = useCallback(
    (section: NavSection) => {
      setActiveSection(section);
      resetIdleTimer();
    },
    [resetIdleTimer],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const idx = NAV_SECTIONS.indexOf(activeSection);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (idx > 0) navigate(NAV_SECTIONS[idx - 1]);
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        if (idx < NAV_SECTIONS.length - 1) navigate(NAV_SECTIONS[idx + 1]);
      } else if (e.key === "Escape") {
        onBackRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeSection, navigate]);

  useEffect(() => {
    document
      .getElementById(`section-${activeSection}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeSection]);

  return (
    <div className="flex flex-col h-screen">
      <TopBar screen="cv-list" />
      <div className="flex" style={{ height: "100dvh", overflow: "hidden" }}>
        <Sidebar
          active={activeSection}
          cursorIdle={cursorIdle}
          onSelect={navigate}
          onBack={() => onBackRef.current()}
        />
        <main
          className="min-h-0 flex-1 overflow-y-auto bg-background px-8 py-8"
          style={{ scrollbarWidth: "none" }}
        >
          <IdentityHeader
            name={RESUME.name}
            title={RESUME.title}
            location={RESUME.location}
            contacts={IDENTITY_CONTACTS}
          />
          <OverviewSection content={RESUME.overview} />
          <ExperienceSection content={RESUME.experience} />
          <StackSection content={RESUME.stack} />
          <ProjectsSection content={RESUME.projects} />
          <EducationSection content={RESUME.education} />
        </main>
      </div>
      <Footer screen="cv-list" onToggleMode={() => {}} />
    </div>
  );
}
