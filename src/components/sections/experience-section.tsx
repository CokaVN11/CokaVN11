import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { ExperienceTimeline } from '@/components/ui/experience-timeline';

import { JobData } from '@/data/jobs';
import { PatternSeparator } from '../ui/pattern-separator';

type ExperienceSectionProps = {
  items: JobData[];
  resumeHref?: string;
  linkedinHref?: string;
};

export function ExperienceSection({ items, resumeHref, linkedinHref }: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      className="mt-10 w-[88vw] sm:w-[70vw] sm:max-w-225 mx-auto flex flex-col"
      aria-labelledby="experience-heading"
    >
      <div className="flex-1 pb-10">
        <SectionHeader id="experience-heading" label="Experience" title="Work" />

        <ExperienceTimeline jobs={items} />

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
      </div>
      <PatternSeparator />
    </section>
  );
}
