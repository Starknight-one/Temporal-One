import Link from "next/link";

export default function TeamPage() {
  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center gap-5 py-12 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF3E0] text-accent">
        <UsersIcon />
      </span>
      <h1 className="font-display text-[34px] font-semibold leading-tight text-fg-primary">
        Team flow ships next.
      </h1>
      <p className="max-w-[460px] text-[14px] leading-relaxed text-fg-secondary">
        For now your log is solo — no team feed, no peer reviews. As soon as
        cohort #1 starts you&apos;ll be matched with 4 builders and this page
        will show their day in real time.
      </p>
      <Link
        href="/app/today"
        className="inline-flex items-center justify-center rounded-full bg-surface-inverse px-5 py-3 text-[13px] font-semibold text-fg-inverse hover:opacity-90"
      >
        Back to your log →
      </Link>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
