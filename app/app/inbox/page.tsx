import Link from "next/link";

export default function InboxPage() {
  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center gap-5 py-12 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF3E0] text-accent">
        <BellIcon />
      </span>
      <h1 className="font-display text-[34px] font-semibold leading-tight text-fg-primary">
        Inbox is empty.
      </h1>
      <p className="max-w-[460px] text-[14px] leading-relaxed text-fg-secondary">
        Reminders, peer feedback and team-event notifications land here. Once
        you&apos;re in a cohort this page fills up fast.
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

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
