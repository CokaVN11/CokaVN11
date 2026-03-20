import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { Project } from './feature-work-section';

type FeaturedProjectCardProps = {
  project: Project;
  index?: number;
  className?: string;
};

export function FeaturedProjectCard({ project, index = 1, className }: FeaturedProjectCardProps) {
  const indexLabel = String(index).padStart(2, '0');
  const { title, category, summary, image, href, tags } = project;

  return (
    <Card
      className={cn(
        'group border border-border shadow-none transition-colors duration-150 hover:border-primary overflow-hidden',
        className
      )}
    >
      <div className="lg:grid lg:grid-cols-[1.4fr_1fr]">
        {image && (
          <div className="relative overflow-hidden border-b aspect-video lg:aspect-auto lg:min-h-80 border-border lg:border-b-0 lg:border-r">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              priority
            />
          </div>
        )}

        {/* Content panel — right column on lg, below image on mobile */}
        <div className="flex flex-col justify-between gap-6 p-6">
          {/* Header: featured label + category */}
          <div className="flex items-start justify-between">
            <p className="font-mono-display text-[10px] uppercase tracking-widest text-primary">
              Featured · {indexLabel}
            </p>
            <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground">
              {category}
            </p>
          </div>

          {/* Title + summary */}
          <div className="space-y-3">
            <h3 className="text-2xl leading-snug font-mono-display text-foreground">{title}</h3>
            <p className="font-serif text-sm leading-relaxed text-muted-foreground">{summary}</p>
          </div>

          {/* Footer: tags + CTA */}
          <div className="space-y-4">
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="font-mono text-[10px] uppercase tracking-wide px-2 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full text-xs tracking-widest uppercase font-mono-display sm:w-auto"
            >
              <a href={href}>View Case Study →</a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
