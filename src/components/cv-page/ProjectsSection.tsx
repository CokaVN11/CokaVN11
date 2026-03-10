import { RESUME } from "@/lib/resume/content";
import { DotDivider } from "@/components/ui/dot-divider";

export function ProjectsSection() {
  return (
    <section id="section-PROJECTS" className="mb-2">
      <h2 className="mb-6 text-heading color-accent">/ PROJECTS</h2>
      {RESUME.projects.map((project, idx) => (
        <div key={project.id} className="mb-8">
          <span className="text-micro color-muted">
            PROJ_{String(idx + 1).padStart(2, "0")} // {project.type}
          </span>
          <p className="mt-1 mb-1 text-heading color-primary">{project.name}</p>
          <hr style={{ borderColor: "var(--text-dim)", borderTopWidth: 1, margin: "8px 0" }} />
          <p className="mb-3 text-ui color-primary">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="text-micro color-accent">
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
      <DotDivider />
    </section>
  );
}
