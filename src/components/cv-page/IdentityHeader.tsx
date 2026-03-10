import { Avatar } from "./Avatar";

// Computed once at module load — updates on each deploy (rendering-hoist-jsx)
const VER = `${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, "0")}`;

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
    <header className="mb-6 pb-6 border-b-4 border-double border-border flex flex-col md:flex-row gap-8 items-start md:items-center">
      {/* Col 1: Avatar */}
      <Avatar src="/avatar.jpg" />

      {/* Col 2: Status + Name + Title + Contacts */}
      <div className="grow">
        <p className="text-micro color-muted mb-2">VER: {VER} </p>
        <h1 className="text-hero tracking-[0.2em] color-primary mb-2">
          {name}
        </h1>
        <p className="text-body color-primary border-l-4 border-accent pl-3 mb-3">
          {title}
        </p>
        <div className="flex gap-4">
          {contacts.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-micro no-underline"
            >
              <span className="color-muted">[</span>
              <span className="color-accent">{key.toUpperCase()}</span>
              <span className="color-muted">]</span>
            </a>
          ))}
        </div>
      </div>

      {/* Col 3: Location meta (right-aligned on md+) */}
      <div className="text-micro color-muted md:text-right space-y-1 shrink-0">
        <p>LOC: {location}</p>
      </div>
    </header>
  );
}
