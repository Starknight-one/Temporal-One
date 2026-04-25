import Link from "next/link";

type NavKey = "feed" | "how" | "hirers" | "signin";

const NAV: { key: NavKey; label: string; href: string }[] = [
  { key: "feed", label: "Feed", href: "/cohort" },
  { key: "how", label: "How it works", href: "/" },
  { key: "hirers", label: "For hirers", href: "/for-hirers" },
  { key: "signin", label: "Sign in", href: "/signin" },
];

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

        <nav className="hidden items-center gap-6 sm:flex">
          {NAV.map((item) => {
            const active = current === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`font-mono text-[12px] transition-colors hover:text-fg-primary ${
                  active
                    ? "font-semibold text-fg-primary"
                    : "text-fg-secondary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/apply"
          className="inline-flex items-center justify-center rounded-full bg-accent px-[18px] py-[10px] text-[13px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover"
        >
          Apply
        </Link>
      </div>
    </header>
  );
}
