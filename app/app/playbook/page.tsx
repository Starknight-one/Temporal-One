import { InterestButton } from "@/components/InterestModal";

export default function PlaybookPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col items-center justify-center gap-5 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF3E0] text-accent">
        <BookIcon />
      </span>
      <h1 className="font-display text-[42px] font-semibold leading-tight text-fg-primary">
        Playbook
      </h1>
      <span className="rounded-full bg-[#FFF3E0] px-3 py-1 font-mono text-[11px] font-semibold tracking-[0.15em] text-accent">
        COMING SOON
      </span>
      <p className="max-w-[480px] text-[15px] leading-relaxed text-fg-secondary">
        A curated knowledge base for your sprint. Reading lists by role, decision
        logs, behavior guidelines, and team-management plays — everything you
        need to manage people without managing.
      </p>
      <InterestButton
        intent="for-hirer"
        target="playbook · cohort 0"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-inverse px-5 py-3 text-[13px] font-semibold text-fg-inverse hover:opacity-90"
      >
        🔔 Notify me when ready
      </InterestButton>
    </div>
  );
}

function BookIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2Z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7Z" />
    </svg>
  );
}
