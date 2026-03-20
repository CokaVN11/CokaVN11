import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';

import { ExperienceCard } from './experience-card';
import { JobData } from '@/data/generateJobs';
import { PatternSeparator } from '../ui/pattern-separator';

type ExperienceTrustSectionProps = {
  items: JobData[];
  resumeHref?: string;
  linkedinHref?: string;
};

export function ExperienceTrustSection({
  items,
  resumeHref,
  linkedinHref,
}: ExperienceTrustSectionProps) {
  return (
    <section
      id="experience"
      className="w-full pb-10 mx-auto sm:pb-14"
      aria-labelledby="experience-heading"
    >
      <SectionHeader id="experience-heading" label="Experience" title="Work" />

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <ExperienceCard key={item.company} item={item} />
        ))}
      </div>

      {(resumeHref || linkedinHref) && (
        <div className="flex gap-3 mt-8">
          {resumeHref && (
            <Button asChild variant="outline" size="sm" className="text-xs font-mono-display">
              <a href={resumeHref}>Resume</a>
            </Button>
          )}
          {linkedinHref && (
            <Button asChild variant="ghost" size="sm" className="text-xs font-mono-display">
              <a href={linkedinHref} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </Button>
          )}
        </div>
      )}

      <PatternSeparator className="mt-10" />
    </section>
  );
}
