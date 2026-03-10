import { RESUME } from "@/lib/resume/content";
import { DotDivider } from "@/components/ui/dot-divider";

const CATEGORIES = [
  { label: "LANGUAGES", items: RESUME.stack.languages },
  { label: "FRONTEND", items: RESUME.stack.frontend },
  { label: "BACKEND", items: RESUME.stack.backend },
  { label: "DATA", items: RESUME.stack.data },
  { label: "INFRA", items: RESUME.stack.infra },
] as const;

export function StackSection() {
  return (
    <section id="section-STACK" className="mb-2">
      <h2 className="mb-6 text-heading color-accent">/ STACK</h2>
      <div className="flex flex-col gap-4">
        {CATEGORIES.map(({ label, items }) => (
          <div key={label} className="flex gap-4">
            <span className="shrink-0 text-micro color-muted" style={{ width: 80 }}>
              {label}
            </span>
            <span className="text-ui color-primary">{items.join("  ")}</span>
          </div>
        ))}
      </div>
      <DotDivider />
    </section>
  );
}
