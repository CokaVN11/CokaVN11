import { RESUME } from "@/lib/resume/content";
import { DotDivider } from "@/components/ui/dot-divider";

export function ExperienceSection() {
  return (
    <section id="section-EXPERIENCE" className="mb-2">
      <h2 className="mb-6 text-heading color-accent">/ EXPERIENCE</h2>
      {RESUME.experience.map((entry, idx) => (
        <div key={entry.id} className="mb-8">
          <div className="mb-2 flex items-center gap-4">
            <span className="text-micro color-muted">FIG.{String(idx + 1).padStart(2, "0")}</span>
            <span
              className="px-2 py-1 text-micro color-muted"
              style={{ border: "1px solid var(--border-muted)" }}
            >
              {entry.period}
            </span>
          </div>
          <p className="mb-1 text-heading color-primary">{entry.title}</p>
          <p className="mb-3 text-ui color-accent">► {entry.company}</p>
          <div className="flex flex-col gap-2">
            {entry.bullets.map((bullet, bi) => (
              <div key={bi} className="flex gap-3">
                <span className="shrink-0 text-micro color-muted">
                  {String(bi + 1).padStart(2, "0")}
                </span>
                <span className="text-ui color-primary">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <DotDivider />
    </section>
  );
}
