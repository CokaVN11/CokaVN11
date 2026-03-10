import { Avatar } from "./Avatar";

interface Contact {
  key: string;
  href: string;
}

interface IdentityHeaderProps {
  name: string;
  title: string;
  location: string;
  contacts: Contact[];
}

export function IdentityHeader({
  name,
  title,
  location,
  contacts,
}: IdentityHeaderProps) {
  return (
    <div className="mb-6 flex gap-6">
      <Avatar src="/avatar.jpg" />

      <div className="flex flex-col justify-center gap-1">
        <span className="text-micro color-muted">
          <span style={{ color: "#39ff14" }}>●</span> ONLINE · V2.0 · AVAILABLE
        </span>
        <span className="text-name color-accent">{name}</span>
        <span className="text-body color-primary">{title}</span>
        <span className="text-micro color-muted">{location}</span>
        <div className="mt-1 flex gap-4">
          {contacts.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
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
