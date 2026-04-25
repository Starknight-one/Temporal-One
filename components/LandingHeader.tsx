import Link from "next/link";

type NavKey = "feed" | "signin";

export function LandingHeader({ current }: { current?: NavKey }) {
  return (
    <header className="sticky top-0 z-40 bg-surface-primary/85 px-6 pt-7 pb-4 backdrop-blur-md sm:px-12 md:px-20">
      <div className="mx-auto flex w-full max-w-[840px] items-center justify-between gap-8 rounded-full border border-border-base bg-surface-primary py-2 pl-6 pr-2">
        <Link
          href="/"
          className="font-display text-[18px] font-semibold text-fg-primary"
        >
          Temporal One
        </Link>
        <Link
          href="/signin"
          className={`inline-flex items-center justify-center rounded-full px-[18px] py-[10px] text-[13px] font-semibold transition-colors ${
            current === "signin"
              ? "bg-surface-card-alt text-fg-primary"
              : "bg-accent text-fg-inverse hover:bg-accent-hover"
          }`}
        >
          Sign in · sign up
        </Link>
      </div>
    </header>
  );
}
