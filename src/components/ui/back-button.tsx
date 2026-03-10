import { Button } from "./button";

interface BackButtonProps {
  onBack: () => void;
  label: string;
}

export function BackButton({ onBack, label }: BackButtonProps) {
  return (
    <Button
      onClick={onBack}
      variant="ghost"
      className="flex items-center justify-start gap-2 px-0 text-label! leading-none color-muted hover:bg-transparent!"
    >
      <span className="-mt-1 leading-none">←</span>
      <span>{label.toUpperCase()}</span>
    </Button>
  );
}
