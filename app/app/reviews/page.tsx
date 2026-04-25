import Link from "next/link";

export default function ReviewsPage() {
  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center gap-5 py-12 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF3E0] text-accent">
        <CheckIcon />
      </span>
      <h1 className="font-display text-[34px] font-semibold leading-tight text-fg-primary">
        Peer reviews ship with team flow.
      </h1>
      <p className="max-w-[460px] text-[14px] leading-relaxed text-fg-secondary">
        Once you join a cohort you&apos;ll rate each teammate daily on two
        anonymous questions — the work, and the collaboration. For now there
        are no peers to review.
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

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
