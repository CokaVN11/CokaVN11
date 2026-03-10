import type { ExperienceEntry } from "@/lib/resume/types";
import { CVSection } from "./CVSection";

interface ExperienceSectionProps {
  content: ExperienceEntry[];
}

export function ExperienceSection({ content }: ExperienceSectionProps) {
  return (
    <CVSection id="EXPERIENCE" title="EXPERIENCE">
      {content.map((entry, idx) => (
        // Left border timeline (matches draft's border-l-2)
        <div key={entry.id} className="relative pl-6 border-l-2 border-muted mb-10">
          {/* Diamond bullet on timeline */}
          <div className="absolute -left-2 top-0 w-4 h-4 bg-foreground border-2 border-background rotate-45" />

          <div className="mb-2 flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-micro color-muted block mb-1">
                FIG.{String(idx + 1).padStart(2, "0")}
              </span>
              <p className="text-heading color-primary">{entry.title}</p>
              <p className="text-ui color-accent">► {entry.company}</p>
            </div>
            <span
              className="px-3 py-1 text-micro color-muted shrink-0"
              style={{ border: "1px solid var(--border-muted)" }}
            >
              {entry.period}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {entry.bullets.map((bullet, bi) => (
              <div key={bi} className="flex gap-4">
                <span className="shrink-0 text-micro color-muted">
                  {String(bi + 1).padStart(2, "0")}
                </span>
                <span className="text-ui color-primary">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </CVSection>
  );
}
