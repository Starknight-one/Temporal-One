import Link from "next/link";

export function SubpageHeader() {
  return (
    <header className="border-b border-border-base bg-surface-primary">
      <div className="flex items-center justify-between px-6 py-5 sm:px-12 md:px-20">
        <Link
          href="/"
          className="font-mono text-[13px] uppercase tracking-[0.3em] text-fg-primary"
        >
          Temporal One
        </Link>
        <Link
          href="/"
          className="font-mono text-xs text-fg-secondary transition-colors hover:text-fg-primary"
        >
          ← Back to home
        </Link>
      </div>
    </header>
  );
}
