import { RESUME } from "@/lib/resume/content";
import { Avatar } from "./Avatar";

export function IdentityHeader() {
  return (
    <div className="mb-6 flex gap-6">
      <Avatar />
      <div className="flex flex-col justify-center gap-1">
        <span className="text-micro color-muted">
          <span style={{ color: "#39ff14" }}>●</span> ONLINE · V2.0 · AVAILABLE
        </span>
        <span className="text-name color-accent">{RESUME.name}</span>
        <span className="text-body color-primary">{RESUME.title}</span>
        <span className="text-micro color-muted">{RESUME.location}</span>
        <div className="mt-1 flex gap-4">
          {Object.entries(RESUME.contact).map(([key, value]) => (
            <a
              key={key}
              href={value.startsWith("http") ? value : `mailto:${value}`}
              target={value.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-micro color-muted no-underline"
            >
              {key.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
