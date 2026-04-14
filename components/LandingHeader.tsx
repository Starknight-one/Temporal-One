import Link from "next/link";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-base bg-surface-primary/85 backdrop-blur-lg">
      <div className="flex items-center justify-between px-6 py-4 sm:px-12 md:px-20 md:py-5">
        <Link
          href="/"
          className="font-mono text-[13px] uppercase tracking-[0.3em] text-fg-primary"
        >
          Temporal One
        </Link>

        <nav className="flex items-center gap-6 sm:gap-10">
          <Link
            href="/cohort"
            className="hidden text-sm text-fg-secondary transition-colors hover:text-fg-primary sm:block"
          >
            Live Cohort
          </Link>
          <Link
            href="/#faq"
            className="hidden text-sm text-fg-secondary transition-colors hover:text-fg-primary sm:block"
          >
            FAQ
          </Link>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-sm bg-accent px-4 py-2.5 text-[13px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover sm:px-5"
          >
            Apply now
          </Link>
        </nav>
      </div>
    </header>
  );
}
