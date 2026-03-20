import Image from 'next/image';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { JobData } from '@/data/generateJobs';

// export type ExperienceItem = {
//   company: string;
//   role: string;
//   summary: string;
//   image?: string;
//   href?: string;
// };

type ExperienceCardProps = {
  item: JobData;
  className?: string;
};

export function ExperienceCard({ item, className }: ExperienceCardProps) {
  const { company, role, summary, cover, href } = item;

  const card = (
    <Card
      className={cn(
        'border border-border shadow-none transition-colors duration-150 hover:border-primary',
        className
      )}
    >
      {cover && (
        <div className="relative overflow-hidden border-b h-28 border-border rounded-t-md bg-muted/30">
          <Image
            src={cover}
            alt={company}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4"
          />
        </div>
      )}

      <div className="p-4 space-y-2">
        <p className="font-mono-display text-[10px] uppercase tracking-widest text-foreground">
          {company}
        </p>
        <h4 className="text-sm leading-snug font-mono-display text-foreground">{role}</h4>
        <p className="font-serif text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {summary}
        </p>
      </div>
    </Card>
  );

  if (href) {
    return (
      <a href={href} className="block group">
        {card}
      </a>
    );
  }

  return card;
}
