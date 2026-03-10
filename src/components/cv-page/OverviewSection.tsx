import { CVSection } from "./CVSection";

interface OverviewSectionProps {
  content: string;
}

export function OverviewSection({ content }: OverviewSectionProps) {
  return (
    <CVSection id="OVERVIEW" title="OVERVIEW" headingSpacing="mb-4">
      <p className="text-ui leading-relaxed color-primary">{content}</p>
    </CVSection>
  );
}
