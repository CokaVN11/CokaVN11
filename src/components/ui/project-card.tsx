import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
  isPriority?: boolean;
  figureIndex?: number;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  image,
  video,
  links,
  className,
  isPriority = false,
  figureIndex = 0,
}: Props) {
  const figLabel = `FIG_${String(figureIndex + 1).padStart(3, '0')}`;

  return (
    <Link href={href || '#'} className={cn('block cursor-pointer group', className)}>
      <div
        className={cn(
          'flex flex-col overflow-hidden border border-border bg-card h-full mx-auto',
          'transition-colors duration-150 group-hover:border-primary'
        )}
      >
        {/* Figure image plate */}
        {video && (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="mx-auto w-full h-40 object-cover object-top pointer-events-none border-b border-border"
          />
        )}
        {image && (
          <div className="border-b border-border">
            <Image
              src={image}
              alt={title}
              width={400}
              height={240}
              quality={75}
              className="w-full h-40 object-cover object-top"
              priority={isPriority}
              loading={isPriority ? 'eager' : 'lazy'}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              style={{
                viewTransitionName: isPriority ? 'project-image' : undefined,
              }}
            />
          </div>
        )}

        <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-2">
          {/* Figure ID + date */}
          <div className="flex items-center justify-between">
            <span className="font-mono-display text-muted-foreground text-[10px] tracking-widest uppercase">
              {figLabel}
            </span>
            <time className="font-mono-display text-muted-foreground text-[10px]">{dates}</time>
          </div>

          {/* Title */}
          <h3 className="font-mono-display text-foreground text-sm leading-snug">{title}</h3>

          {/* Description */}
          <p className="font-serif text-muted-foreground text-xs leading-relaxed line-clamp-3 text-pretty">
            {description}
          </p>

          {/* Tags — mono index labels */}
          {tags && tags.length > 0 && (
            <p className="font-mono-display text-muted-foreground text-[10px] tracking-wide mt-auto pt-1">
              {tags
                .slice(0, 4)
                .join(' · ')
                .concat(tags.length > 4 ? ` · +${tags.length - 4}` : '')}
            </p>
          )}

          {/* Links */}
          {links && links.length > 0 && (
            <div className="flex flex-row flex-wrap items-start gap-3 pt-1 border-t border-border mt-1">
              {links.map((link, idx) => (
                <Link
                  href={link.href}
                  key={idx}
                  target="_blank"
                  className="font-mono-display text-muted-foreground hover:text-primary text-[10px] tracking-wide flex items-center gap-1 transition-colors duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  {link.icon}
                  {link.type}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}