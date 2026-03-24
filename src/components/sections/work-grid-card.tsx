import Image from 'next/image';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

import type { Project } from './work-section';

type WorkGridCardProps = {
  project: Project;
  index?: number;
  className?: string;
};

export function WorkGridCard({ project, index = 1, className }: WorkGridCardProps) {
  const indexLabel = String(index).padStart(2, '0');
  const { title, category, summary, image, href } = project;

  return (
    <a href={href} className="block h-full group">
      <Card
        className={cn(
          'overflow-hidden h-full border border-border shadow-none transition-colors duration-150 group-hover:border-primary',
          className
        )}
      >
        {image && (
          <div className="relative overflow-hidden border-b aspect-video border-border">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-col flex-1 gap-2 p-4">
          <div className="flex items-center justify-between">
            <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground">
              {category}
            </p>
            <span className="font-mono-display text-[10px] text-primary">FIG_{indexLabel}</span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm leading-snug font-mono-display text-foreground">{title}</h3>
            <p className="font-serif text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {summary}
            </p>
          </div>
          <p
            className="font-mono-display text-[10px] uppercase tracking-widest text-primary
              opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            View →
          </p>
        </div>
      </Card>
    </a>
  );
}
