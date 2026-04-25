import type { ReactNode } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <LandingHeader current="how" />
      <main className="bg-surface-primary">
        <Hero />
        <FourStepPath />
        <LogEntrySection />
        <PublicVsPaid />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

/* -------------------------- Hero -------------------------- */

function Hero() {
  return (
    <section className="flex flex-col items-center gap-5 px-6 pb-10 pt-16 sm:px-12 md:px-20">
      <Eyebrow>How it works</Eyebrow>
      <h1 className="max-w-[880px] text-center font-display text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-fg-primary sm:text-6xl md:text-[64px]">
        One month. Five people.
        <br />
        A log nobody can fake.
      </h1>
      <p className="max-w-[680px] text-center text-[17px] leading-[1.5] text-fg-secondary">
        You join a team of five, build something real for a month, and every
        day of work becomes verified evidence — not a resume bullet.
      </p>
    </section>
  );
}

/* -------------------------- 4-step path -------------------------- */

const STEPS = [
  {
    n: "01",
    t: "Apply",
    d: "One toggle: build or hire. Drop your LinkedIn. No cover letter, no take-home.",
  },
  {
    n: "02",
    t: "Match",
    d: "You join an open lab for 3 days. Pitch ideas, find your people. By day 4 you're in a team of 5.",
  },
  {
    n: "03",
    t: "Build · 30 days",
    d: "Ship a real product on a tiny budget. Every day you log work + artifact. Tiimates rate skill and behavior.",
  },
  {
    n: "04",
    t: "Land",
    d: "Either the startup goes — or your verified log gets bought. Hirers pay to see the real thing.",
  },
];

function FourStepPath() {
  return (
    <SectionWrap>
      <div className="overflow-hidden rounded-2xl border border-border-base bg-surface-card">
        <div className="flex items-center justify-between border-b border-border-base px-7 py-5">
          <h2 className="font-display text-xl font-semibold text-fg-primary">
            The 4-step path
          </h2>
          <span className="font-mono text-[11px] text-fg-muted">
            ~30 days · $200 budget · 4h/day
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className={`flex flex-col gap-3 px-6 py-7 ${
                i < STEPS.length - 1
                  ? "border-b border-border-base lg:border-b-0 lg:border-r"
                  : ""
              } ${i % 2 === 0 ? "sm:border-r sm:border-border-base" : ""} ${
                i < STEPS.length - 2 ? "sm:border-b sm:border-border-base" : ""
              }`}
            >
              <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-accent">
                {s.n}
              </span>
              <h3 className="font-display text-[22px] font-semibold leading-tight text-fg-primary">
                {s.t}
              </h3>
              <p className="text-[13px] leading-[1.5] text-fg-secondary">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

/* -------------------------- Log entry detail -------------------------- */

const FIELDS = [
  "What I did — one line",
  "Artifact — link, file, embed (required)",
  "Time spent — hours",
  "Self-tag — built / fixed / shipped / blocked …",
  "Note — what you learned, where you got stuck",
];

function LogEntrySection() {
  return (
    <SectionWrap>
      <div className="grid gap-6 lg:grid-cols-[1fr_520px]">
        <div className="flex flex-col gap-4 py-2">
          <Eyebrow>Inside a log entry</Eyebrow>
          <h2 className="max-w-[560px] font-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-fg-primary sm:text-[36px]">
            Five fields. One artifact. Two scores.
          </h2>
          <p className="max-w-[560px] text-[14px] leading-[1.55] text-fg-secondary">
            No artifact, no entry. Tiimates rate every day on skill and
            behavior. Skip 2 days of scoring and you&apos;re auto-kicked from
            the team.
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {FIELDS.map((f) => (
              <li
                key={f}
                className="font-mono text-[12px] text-[#333]"
              >
                · &nbsp;{f}
              </li>
            ))}
          </ul>
        </div>

        <SampleLogCard />
      </div>
    </SectionWrap>
  );
}

function SampleLogCard() {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border-base bg-surface-card p-5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-fg-inverse">
            SK
          </span>
          <span className="text-[13px] font-semibold text-fg-primary">
            Sasha K. &nbsp;·&nbsp; Team #42
          </span>
        </div>
        <span className="font-mono text-[11px] text-fg-muted">
          day 14 · 18:42
        </span>
      </header>

      <p className="text-[14px] font-medium text-fg-primary">
        pushed 13 commits → match scoring v2 endpoint
      </p>

      <div className="flex flex-wrap gap-2">
        <Chip>code · 3h</Chip>
        <Chip>shipped</Chip>
        <Chip variant="success">skill 4.8 / behavior 5.0</Chip>
      </div>
    </article>
  );
}

function Chip({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success";
}) {
  if (variant === "success") {
    return (
      <span className="inline-flex items-center rounded-full border border-[#D9F0BE] bg-[#F0F9E8] px-2.5 py-[5px] font-mono text-[11px] text-[#3D7B0E]">
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-border-base bg-surface-card-alt px-2.5 py-[5px] font-mono text-[11px] text-fg-secondary">
      {children}
    </span>
  );
}

/* -------------------------- Public vs Paid table -------------------------- */

const ROWS: { field: string; pub: "yes" | "no" | "toggle"; paid: boolean }[] = [
  { field: "Artifact type, category, volume", pub: "yes", paid: true },
  { field: "Time spent + aggregated peer scores", pub: "yes", paid: true },
  { field: "The artifact itself (code, design, doc)", pub: "no", paid: true },
  { field: "What I did + my note", pub: "no", paid: true },
  { field: "Project name (team's choice)", pub: "toggle", paid: true },
];

function PublicVsPaid() {
  return (
    <SectionWrap>
      <div className="rounded-2xl border border-border-base bg-surface-card px-8 py-7">
        <div className="flex flex-col gap-2">
          <Eyebrow>What&apos;s public, what&apos;s paid</Eyebrow>
          <h2 className="font-display text-2xl font-semibold leading-[1.15] tracking-[-0.01em] text-fg-primary sm:text-[26px]">
            You see enough to trust it. Hirers pay to read the actual work.
          </h2>
        </div>

        <div className="mt-5">
          <div className="grid grid-cols-[1fr_120px_120px] border-b border-border-base py-3 sm:grid-cols-[1fr_200px_200px]">
            <ColHead>Field</ColHead>
            <ColHead className="text-center">Public</ColHead>
            <ColHead className="text-center">Paid</ColHead>
          </div>
          {ROWS.map((r, i) => (
            <div
              key={r.field}
              className={`grid grid-cols-[1fr_120px_120px] items-center py-3.5 sm:grid-cols-[1fr_200px_200px] ${
                i < ROWS.length - 1 ? "border-b border-border-soft" : ""
              }`}
            >
              <span className="px-3 text-[13px] text-[#333]">{r.field}</span>
              <span className="px-3 text-center">
                {r.pub === "yes" ? (
                  <Check />
                ) : r.pub === "toggle" ? (
                  <span className="font-mono text-[11px] text-fg-muted">
                    toggle
                  </span>
                ) : (
                  <Dash />
                )}
              </span>
              <span className="px-3 text-center">
                {r.paid ? <Check /> : <Dash />}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

function ColHead({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`px-3 font-mono text-[10px] tracking-[0.2em] text-fg-muted ${className}`}
    >
      {String(children).toUpperCase()}
    </span>
  );
}

function Check() {
  return <span className="text-[14px] font-semibold text-[#3D7B0E]">✓</span>;
}

function Dash() {
  return <span className="text-[14px] text-[#CCC]">—</span>;
}

/* -------------------------- Final CTA -------------------------- */

function FinalCTA() {
  return (
    <SectionWrap className="pb-20">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface-inverse px-10 py-14 text-center">
        <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-fg-inverse sm:text-[42px]">
          Stop applying. Start logging.
        </h2>
        <p className="text-[15px] text-fg-muted">
          Next cohort opens soon. ~$200 team budget. Five seats per team.
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-[14px] text-[14px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover"
          >
            I&apos;m building → join a team
          </Link>
          <Link
            href="/for-hirers"
            className="inline-flex items-center justify-center rounded-full border-[1.5px] border-white bg-surface-inverse px-6 py-[14px] text-[14px] font-semibold text-fg-inverse transition-colors hover:bg-[#1a1a1a]"
          >
            I&apos;m hiring → unlock logs
          </Link>
        </div>
      </div>
    </SectionWrap>
  );
}

/* -------------------------- Shared -------------------------- */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.35em] text-fg-muted">
      {String(children).toUpperCase()}
    </span>
  );
}

function SectionWrap({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`px-6 py-10 sm:px-12 md:px-20 ${className}`}
    >
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  );
}
