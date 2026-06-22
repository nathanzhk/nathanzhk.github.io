import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import { profile, type ContactIcon } from '@/data/intro';

const contactIcons = {
  email: FaEnvelope,
  github: FaGithub,
  linkedin: FaLinkedin,
} satisfies Record<ContactIcon, IconType>;

export function Introduce() {
  const { name, title, location, bio, contacts } = profile;
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{name}</h1>
      <p className="text-foreground mt-3 text-lg font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg">
        <span>{location.base}</span>
        {location.relocateTo && (
          <>
            <span aria-hidden>·</span>
            <span>Open to relocating to {location.relocateTo}</span>
          </>
        )}
      </p>
      {bio.map((paragraph) => (
        <p
          key={paragraph}
          className="text-muted-foreground mt-3 leading-relaxed"
        >
          {paragraph}
        </p>
      ))}
      <ul className="mt-6 flex items-center gap-4">
        {contacts.map(({ label, href, icon }) => {
          const Icon = contactIcons[icon];
          return (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-muted-foreground hover:text-foreground inline-flex transition-colors"
              >
                <Icon className="size-5" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
