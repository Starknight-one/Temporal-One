import Link from "next/link";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <LandingHeader current="feed" />
      <main className="bg-surface-primary">
        <section className="flex flex-col items-center gap-8 px-6 pb-10 pt-16 sm:px-12 md:px-20">
          <h1 className="text-center font-sans text-5xl font-bold leading-[1.05] tracking-[-0.035em] text-fg-primary sm:text-6xl md:text-[84px]">
            Can&apos;t find work?
            <br />
            Just create it.
          </h1>

          <p className="max-w-[640px] text-center text-[15px] leading-relaxed text-fg-secondary sm:text-base">
            Five strangers, thirty days, one shipped product. Every day of work
            goes into a public log — proof, not promises. Hirers pay to read
            full logs and see who&apos;s actually shipping.
          </p>

          <div className="flex flex-col gap-3.5 sm:flex-row">
            <Link
              href="/for-hirers"
              className="inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-black bg-surface-card px-[22px] py-[14px] text-[14px] font-semibold text-fg-primary transition-colors hover:bg-surface-card-alt"
            >
              <BriefcaseIcon />
              I&apos;m hiring
              <span className="font-mono text-[11px] font-normal text-fg-muted">
                unlock logs
              </span>
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center gap-2.5 rounded-full bg-accent px-[22px] py-[14px] text-[14px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover"
            >
              <HammerIcon />
              I&apos;m building
              <span className="font-mono text-[11px] font-normal text-[#FFE0B2]">
                sign up · sign in
              </span>
            </Link>
          </div>
        </section>

        <section className="px-6 pb-20 sm:px-12 md:px-20">
          <div className="mx-auto max-w-[840px] rounded-2xl border border-dashed border-border-base bg-surface-card-alt px-8 py-12 text-center sm:px-14 sm:py-16">
            <span className="font-mono text-[10px] font-semibold tracking-[0.25em] text-accent">
              COHORT #1 · NOT YET STARTED
            </span>
            <h2 className="mt-4 font-display text-[28px] font-semibold leading-tight text-fg-primary sm:text-[34px]">
              The first sprint hasn&apos;t started yet.
            </h2>
            <p className="mx-auto mt-3 max-w-[540px] text-[14px] leading-relaxed text-fg-secondary">
              No active cohorts means no public logs to scroll yet. Sign up
              with Google or Telegram now — your account&apos;s ready, and
              you&apos;ll be matched into cohort #1 when it starts.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signin"
                className="inline-flex items-center gap-2 rounded-full bg-surface-inverse px-5 py-3 text-[13px] font-semibold text-fg-inverse hover:opacity-90"
              >
                Sign up · sign in →
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-black bg-surface-card px-5 py-3 text-[13px] font-semibold text-fg-primary hover:bg-surface-card-alt"
              >
                How it works
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function HammerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9" />
      <path d="M17.64 15 22 10.64" />
      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
    </svg>
  );
}
