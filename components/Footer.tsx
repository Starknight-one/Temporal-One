export function Footer() {
  return (
    <footer className="border-t border-border-base bg-surface-primary px-6 py-7 sm:px-12 md:px-20">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
        <span className="font-mono text-[11px] text-fg-muted">
          © 2026 Temporal One — proof, not promises.
        </span>
        <a
          href="mailto:starknight@keepstar.one"
          className="font-mono text-[11px] text-fg-secondary transition-colors hover:text-fg-primary"
        >
          contact
        </a>
      </div>
    </footer>
  );
}
