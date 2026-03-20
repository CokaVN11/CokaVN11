import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

type EducationCapabilitiesSectionProps = {
  education: EducationItem;
  capabilities: CapabilityGroup[];
  className?: string;
};

function EducationCard({ education }: { education: EducationItem }) {
  return (
    <Card className="p-5 border shadow-none border-border">
      <div className="flex items-start gap-6">
        <div className="w-8 h-0.5 bg-primary mt-2.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground">
            Education
          </p>
          <h4 className="text-sm leading-snug font-mono-display text-foreground">
            {education.school}
          </h4>
          <p className="font-serif text-xs leading-relaxed text-muted-foreground">
            {education.degree}
          </p>
          {(education.startDate || education.endDate) && (
            <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground">
              {education.startDate} — {education.endDate ?? 'Present'}
            </p>
          )}
          {education.details && (
            <p className="font-serif text-xs leading-relaxed text-muted-foreground">
              {education.details}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function CapabilitiesCard({ groups }: { groups: CapabilityGroup[] }) {
  return (
    <Card className="h-full p-5 border shadow-none border-border">
      <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
        Capabilities
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <h5 className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border pb-1">
              {group.title}
            </h5>
            <ul className="mt-2 space-y-1.5">
              {group.items.map((item: string) => (
                <li key={item} className="font-mono text-xs text-foreground flex items-baseline gap-1.5">
                  <span className="text-primary" aria-hidden="true">·</span>
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

export function EducationCapabilitiesSection({
  education,
  capabilities,
  className,
}: EducationCapabilitiesSectionProps) {
  return (
    <section
      id="education-capabilities"
      className={cn('w-full mx-auto pb-14 sm:pb-20', className)}
      aria-label="Education and Capabilities"
    >
      <div className="flex flex-col gap-6">
        <EducationCard education={education} />
        <CapabilitiesCard groups={capabilities} />
      </div>
    </section>
  );
}
