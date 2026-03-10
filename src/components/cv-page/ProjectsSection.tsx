import type { ProjectEntry } from "@/lib/resume/types";
import { CVSection } from "./CVSection";

interface ProjectsSectionProps {
  content: ProjectEntry[];
}

export function ProjectsSection({ content }: ProjectsSectionProps) {
  return (
    <CVSection id="PROJECTS" title="PROJECTS">
      {content.map((project, idx) => (
        <div key={project.id} className="mb-8">
          <span className="text-micro color-muted">
            PROJ_{String(idx + 1).padStart(2, "0")} // {project.type}
          </span>
          <p className="mt-1 mb-1 text-heading color-primary">{project.name}</p>
            <hr className="border-t border-(--text-dim) my-2" />
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
    </CVSection>
  );
}
