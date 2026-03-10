import type { EducationEntry } from "@/lib/resume/types";
import { CVSection } from "./CVSection";

interface EducationSectionProps {
  content: EducationEntry[];
}

export function EducationSection({ content }: EducationSectionProps) {
  return (
    <CVSection id="EDUCATION" title="EDUCATION">
      {content.map((entry, idx) => (
        <div key={idx} className="mb-4">
          <p className="mb-1 text-heading color-primary">{entry.degree}</p>
          <p className="mb-1 text-ui color-accent">► {entry.school}</p>
          <p className="text-micro color-muted">
            {entry.period}
            {entry.gpa ? `  ·  GPA ${entry.gpa}` : ""}
          </p>
        </div>
      ))}
    </CVSection>
  );
}
