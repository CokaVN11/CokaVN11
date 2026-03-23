import { ProjectData } from '@/data/projects';

import { WorkCard } from './work-card';
import { WorkGridCard } from './work-grid-card';
import { SectionHeader } from '../ui/section-header';
import { PatternSeparator } from '../ui/pattern-separator';

export type Project = {
  id: string;
  title: string;
  category: string;
  summary: string;
  image: string;
  href: string;
  tags?: string[];
};

function projectDataToProject(p: ProjectData): Project {
  return {
    id: p.slug,
    title: p.title,
    category: p.tags[0] ?? p.technologies[0] ?? '',
    summary: p.summary ?? p.description,
    image: p.cover ?? '',
    href: p.href,
    tags: p.tags,
  };
}

type WorkSectionProps = {
  featured: ProjectData;
  supporting: ProjectData[];
};

export function WorkSection({ featured, supporting }: WorkSectionProps) {
  return (
    <section
      id="featured-work"
      className="w-full mx-auto mt-10 min-h-dvh flex flex-col"
      aria-labelledby="featured-work-heading"
    >
      <div className="flex-1 pb-10">
        <SectionHeader
          id="featured-work-heading"
          label="Featured Work"
          title="Projects"
          description="A selection of projects that showcase my skills and experience."
        />

        <WorkCard project={projectDataToProject(featured)} index={1} />

        <div className="flex items-center gap-4 mt-10 mb-6">
          <span className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground">
            More Projects
          </span>
          <PatternSeparator className="flex-1" height={8} />
        </div>

        <div className="grid gap-4 mt-8 md:grid-cols-2">
          {supporting.map((p, i) => (
            <WorkGridCard key={p.slug} project={projectDataToProject(p)} index={i + 2} />
          ))}
        </div>
      </div>
      <PatternSeparator />
    </section>
  );
}
