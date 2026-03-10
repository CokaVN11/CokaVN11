import type { StackData } from "@/lib/resume/types";
import { CVSection } from "./CVSection";

// Ordered display labels mapped to StackData keys (hoisted — static)
const STACK_CATEGORIES: { key: keyof StackData; label: string }[] = [
  { key: "languages", label: "LANGUAGES" },
  { key: "frontend", label: "FRONTEND" },
  { key: "backend", label: "BACKEND" },
  { key: "data", label: "DATA" },
  { key: "infra", label: "INFRA" },
];

interface StackSectionProps {
  content: StackData;
}

export function StackSection({ content }: StackSectionProps) {
  return (
    <CVSection id="STACK" title="STACK">
      <div className="flex flex-col gap-4">
        {STACK_CATEGORIES.map(({ key, label }) => (
          <div key={label} className="flex gap-4">
            <span className="shrink-0 text-micro color-muted w-20">
              {label}
            </span>
            <span className="text-ui color-primary">
              {content[key].join("  ")}
            </span>
          </div>
        ))}
      </div>
    </CVSection>
  );
}
