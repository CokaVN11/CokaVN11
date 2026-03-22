import { Card } from '@/components/ui/card';
import { PatternSeparator } from '@/components/ui/pattern-separator';
import { cn } from '@/lib/utils/cn';

export interface EducationItem {
  school: string;
  href: string;
  degree: string;
  startDate?: string;
  endDate?: string;
  logoUrl?: string;
  details?: string;
}

export type CapabilityGroup = {
  title?: string;
  items: string[];
};

type SkillsSectionProps = {
  education: EducationItem;
  capabilities: CapabilityGroup[];
  className?: string;
};

function CapabilitiesCard({
  education,
  groups,
}: {
  education: EducationItem;
  groups: CapabilityGroup[];
}) {
  return (
    <Card className="h-full p-5 border shadow-none border-border">
      <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
        Capabilities
      </p>

      <div className="mb-5 pb-5 border-b border-border">
        <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground">
          {education.school}
        </p>
        <p className="font-serif text-xs text-muted-foreground">
          {education.degree}
          {education.endDate && ` · ${education.endDate}`}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <h5 className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border pb-1">
              {group.title}
            </h5>
            <ul className="mt-2 space-y-1.5">
              {group.items.map((item: string) => (
                <li
                  key={item}
                  className="font-mono text-xs text-foreground flex items-baseline gap-1.5"
                >
                  <span className="text-primary" aria-hidden="true">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function SkillsSection({ education, capabilities, className }: SkillsSectionProps) {
  return (
    <section
      id="education-capabilities"
      className={cn('w-full mx-auto min-h-dvh flex flex-col snap-start', className)}
      aria-label="Education and Capabilities"
    >
      <div className="flex-1 pb-10">
        <CapabilitiesCard education={education} groups={capabilities} />
      </div>
      <PatternSeparator />
    </section>
  );
}
