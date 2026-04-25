import Link from "next/link";

const LINKS = [
  { label: "about", href: "#" },
  { label: "changelog", href: "#" },
  { label: "twitter", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-base bg-surface-primary px-6 py-7 sm:px-12 md:px-20">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
        <span className="font-mono text-[11px] text-fg-muted">
          © 2026 Temporal One — proof, not promises.
        </span>
        <nav className="flex items-center gap-5">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="font-mono text-[11px] text-fg-secondary transition-colors hover:text-fg-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
