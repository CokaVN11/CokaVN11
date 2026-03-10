import type { ReactNode } from "react";

interface CVSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  headingSpacing?: string;
}

export function CVSection({
  id,
  title,
  children,
  headingSpacing = "mb-6",
}: CVSectionProps) {
  return (
    <section id={`section-${id}`} className="mb-8">
      {/* Heading row: inverted label + dashed rule extending right */}
      <div className={`flex items-center gap-4 ${headingSpacing}`}>
        <h2 className="shrink-0 bg-foreground text-background text-heading px-2 py-1">
          /{title}
        </h2>
        <div
          className="grow h-1 rule-scan"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--border-muted) 0, var(--border-muted) 6px, transparent 6px, transparent 12px)",
          }}
        />
      </div>
      {children}
    </section>
  );
}
