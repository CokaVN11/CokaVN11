import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

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
  isPriority?: boolean; // Add prop to identify first project card
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  className,
  isPriority = false, // Default to false
}: Props) {
  return (
    <Link to={href || '/'} className={cn('block cursor-pointer', className)}>
      <Card
        className={
          'flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full mx-auto'
        }
      >
        {video && (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="mx-auto w-full h-40 object-cover object-top pointer-events-none" // needed because random black line at bottom of video
          />
        )}
        {image && (
          <img
            src={image}
            alt={title}
            className="rounded-t-lg w-full h-40 object-cover object-top overflow-hidden"
            loading={isPriority ? 'eager' : 'lazy'}
          />
        )}

        <CardHeader className="px-4">
          <div className="space-y-1">
            <CardTitle className="mt-2 text-base">{title}</CardTitle>
            <time className="font-sans text-xs">{dates}</time>
            <div className="hidden print:visible font-sans text-xs underline">
              {link?.replace('https://', '').replace('www.', '').replace('/', '')}
            </div>
            <p className="dark:prose-invert max-w-full font-sans text-muted-foreground text-xs text-pretty prose">
              {description}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col mt-auto mb-3 px-4">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge className="px-1 py-0 text-[10px]" variant="secondary" key={tag}>
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge className="px-1 py-0 text-[10px]" variant="secondary">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        {links && links.length > 0 && (
          <CardFooter className="px-2 pb-2">
            <div className="flex flex-row flex-wrap items-start gap-1">
              {links?.map((link, idx) => (
                <a href={link?.href} key={idx} target="_blank" rel="noopener noreferrer">
                  <Badge key={idx} className="flex gap-2 px-2 py-1 text-[10px]">
                    {link.icon}
                    {link.type}
                  </Badge>
                </a>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
