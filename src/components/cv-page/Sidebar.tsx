import { NAV_SECTIONS, type NavSection } from "@/lib/resume/types";
import { SidebarIndicator, type IndicatorState } from "../ui/sidebar-indicator";
import { BackButton } from "../ui/back-button";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const IDENTIFIER_LABEL = <span className="mb-2 text-label color-muted">IDENTIFIER</span>;

function LabelButton({
  label,
  onClick,
  isActive,
  cursorIdle,
}: {
  label: string;
  onClick: () => void;
  isActive: boolean;
  cursorIdle: boolean;
}) {
  const indicatorState: IndicatorState = !isActive ? "hidden" : cursorIdle ? "blinking" : "visible";
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        "justify-start gap-2 px-0 text-label! hover:bg-transparent!",
        isActive ? "color-accent" : "color-muted",
      )}
    >
      <SidebarIndicator state={indicatorState} />
      {label}
    </Button>
  );
}

export function Sidebar({
  active,
  cursorIdle,
  onSelect,
  onBack,
}: {
  active: NavSection;
  cursorIdle: boolean;
  onSelect: (s: NavSection) => void;
  onBack: () => void;
}) {
  return (
    <aside className="flex w-40 shrink-0 flex-col justify-between border-r border-r-(--border-muted) bg-sidebar px-4 py-8">
      <div className="flex flex-col gap-4">
        {IDENTIFIER_LABEL}
        {NAV_SECTIONS.map((section) => (
          <LabelButton
            key={section}
            label={section}
            onClick={() => onSelect(section)}
            isActive={active === section}
            cursorIdle={cursorIdle}
          />
        ))}
      </div>
      <BackButton onBack={onBack} label="Return" />
    </aside>
  );
}
