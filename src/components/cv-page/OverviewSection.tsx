import { RESUME } from "@/lib/resume/content";
import { DotDivider } from "@/components/ui/dot-divider";

export function OverviewSection() {
  return (
    <section id="section-OVERVIEW" className="mb-2">
      <h2 className="mb-4 text-heading color-accent">/ OVERVIEW</h2>
      <p className="text-ui leading-relaxed color-primary">{RESUME.overview}</p>
      <DotDivider />
    </section>
  );
}
