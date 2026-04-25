import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "For hirers — Temporal One",
  description:
    "Skip the resume theater. Read 30 days of verified daily logs — code, design, docs, customer calls — scored every day by the people who worked next to them.",
};

export default function ForHirersPage() {
  return (
    <>
      <LandingHeader current="hirers" />
      <main className="bg-surface-primary">
        <Hero />
        <HiringIsBroken />
        <WhatYouGet />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

/* -------------------------- Hero -------------------------- */

function Hero() {
  return (
    <section className="flex flex-col items-center gap-5 px-6 pb-10 pt-16 sm:px-12 md:px-20">
      <Eyebrow>For hirers</Eyebrow>
      <h1 className="max-w-[880px] text-center font-display text-5xl font-semibold leading-[1.05] tracking-[-0.025em] text-fg-primary sm:text-6xl md:text-7xl">
        Hire from work,
        <br />
        not from words.
      </h1>
      <p className="max-w-[720px] text-center text-[17px] leading-[1.5] text-fg-secondary">
        Skip the resume theater. Read 30 days of verified daily logs — code,
        design, docs, customer calls — scored every day by the people who
        worked next to them.
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Link
          href="#pricing"
          className="inline-flex items-center justify-center rounded-full bg-surface-inverse px-[22px] py-[14px] text-[14px] font-semibold text-fg-inverse transition-colors hover:opacity-90"
        >
          Talk to us — get pilot access
        </Link>
        <Link
          href="#pricing"
          className="inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-surface-card px-[22px] py-[14px] text-[14px] font-semibold text-fg-primary transition-colors hover:bg-surface-card-alt"
        >
          Unlock one log — $500
        </Link>
      </div>
    </section>
  );
}

/* -------------------------- Hiring is broken -------------------------- */

const STATS = [
  { n: "242", d: "applications per role on average — 3× the 2017 number." },
  { n: "41%", d: "of resumes never reach a human reviewer." },
  { n: "61%", d: "of candidates get ghosted after interviewing." },
  { n: "~20%", d: "of public job posts are ghost jobs that never hire." },
];

function HiringIsBroken() {
  return (
    <SectionWrap>
      <div className="overflow-hidden rounded-2xl border border-border-base bg-surface-card">
        <div className="flex items-center justify-between border-b border-border-base px-7 py-5">
          <h2 className="font-display text-xl font-semibold text-fg-primary">
            Hiring is broken
          </h2>
          <span className="font-mono text-[11px] text-fg-muted">
            sources: layoffs.fyi · LinkedIn · Greenhouse · Resume Builder 2025
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.n}
              className={`flex flex-col gap-2 px-6 py-7 ${
                i < STATS.length - 1
                  ? "border-b border-border-base lg:border-b-0 lg:border-r"
                  : ""
              } ${i % 2 === 0 ? "sm:border-r sm:border-border-base" : ""} ${
                i < STATS.length - 2 ? "sm:border-b sm:border-border-base" : ""
              }`}
            >
              <span className="font-display text-[42px] font-semibold leading-none tracking-[-0.02em] text-fg-primary">
                {s.n}
              </span>
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

/* -------------------------- What you get -------------------------- */

const GET_ITEMS = [
  {
    title: "The actual artifacts",
    body:
      "PRs, Figma frames, transcripts, dashboards — every one tied to a date and a task.",
  },
  {
    title: "Daily peer scores",
    body:
      "Two channels — skill (work was real and good) and behavior (was decent to work with). Anonymous to teammates, full transcript to you.",
  },
  {
    title: "Tamper-proof timeline",
    body:
      "No edits after the fact, no deleted entries, no skipped scoring days. If a builder tried to game it, you'll see.",
  },
];

function WhatYouGet() {
  return (
    <SectionWrap>
      <div className="grid gap-6 lg:grid-cols-[1fr_520px]">
        <div className="flex flex-col gap-5">
          <Eyebrow>What you get</Eyebrow>
          <h2 className="max-w-[560px] font-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-fg-primary sm:text-[36px]">
            30 days of evidence per candidate.
          </h2>
          <ul className="mt-2 flex flex-col gap-5">
            {GET_ITEMS.map((it) => (
              <li key={it.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="mt-1 inline-block h-[10px] w-[10px] flex-none rounded-full bg-accent"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="text-[14px] font-semibold text-fg-primary">
                    {it.title}
                  </h3>
                  <p className="max-w-[520px] text-[13px] leading-[1.5] text-fg-secondary">
                    {it.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <PreviewCard />
      </div>
    </SectionWrap>
  );
}

function PreviewCard() {
  return (
    <article className="flex flex-col gap-3.5 rounded-xl border border-border-base bg-surface-card p-5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-inverse text-[11px] font-semibold text-fg-inverse">
            AY
          </span>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-fg-primary">
              Aya S.
            </span>
            <span className="font-mono text-[11px] text-fg-muted">
              backend / data · TeamPulse
            </span>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full border border-[#D9F0BE] bg-[#F0F9E8] px-3 py-1.5 font-mono text-[11px] font-semibold text-[#3D7B0E]">
          verified · 30/30
        </span>
      </header>

      <div className="grid grid-cols-3 rounded-lg border border-border-base bg-surface-card-alt">
        <Stat n="4.7" l="skill" border />
        <Stat n="4.9" l="behavior" border />
        <Stat n="123h" l="logged time" />
      </div>

      <PreviewEntry day="d28" text="finished sign-up + email verification — async backend ready" />
      <PreviewEntry day="d27" text="migrated DB to Postgres + 4 sessions tables live" />

      <Link
        href="#"
        className="mt-1 inline-flex items-center justify-center rounded-full bg-surface-inverse px-4 py-3 text-[13px] font-semibold text-fg-inverse transition-colors hover:opacity-90"
      >
        Unlock full log — $500
      </Link>
    </article>
  );
}

function Stat({ n, l, border = false }: { n: string; l: string; border?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-1 px-4 py-3.5 ${
        border ? "border-r border-border-base" : ""
      }`}
    >
      <span className="font-display text-[22px] font-semibold leading-none text-fg-primary">
        {n}
      </span>
      <span className="font-mono text-[10px] tracking-[0.2em] text-fg-muted">
        {l.toUpperCase()}
      </span>
    </div>
  );
}

function PreviewEntry({ day, text }: { day: string; text: string }) {
  return (
    <div className="flex gap-2.5 border-t border-border-soft pt-2">
      <span className="w-8 font-mono text-[11px] text-fg-muted">{day}</span>
      <span className="flex-1 text-[13px] leading-[1.5] text-[#333]">
        {text}
      </span>
    </div>
  );
}

/* -------------------------- Pricing -------------------------- */

function Pricing() {
  return (
    <SectionWrap>
      <div id="pricing" className="grid gap-4 lg:grid-cols-3">
        {/* Individual */}
        <article className="flex flex-col gap-3 rounded-2xl border border-border-base bg-surface-card p-7">
          <span className="font-mono text-[10px] font-normal tracking-[0.25em] text-fg-muted">
            INDIVIDUAL · UNLIMITED
          </span>
          <span className="font-display text-[42px] font-semibold leading-none tracking-[-0.02em] text-fg-primary">
            $150
          </span>
          <p className="text-[13px] leading-[1.5] text-fg-secondary">
            Unlimited reads of any builder&apos;s full log — artifacts, notes,
            scoring, comments. Per month.
          </p>
          <button
            type="button"
            className="mt-1 inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-surface-card px-5 py-3 text-[13px] font-semibold text-fg-primary transition-colors hover:bg-surface-card-alt"
          >
            Start monthly access
          </button>
        </article>

        {/* Pro */}
        <article className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-accent bg-surface-card p-7">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold tracking-[0.25em] text-accent">
              PRO · ARTIFACT SEARCH
            </span>
            <span className="inline-flex items-center rounded-full border border-[#FFD9A8] bg-[#FFF4E5] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#9E5B00]">
              most useful
            </span>
          </div>
          <span className="font-display text-[42px] font-semibold leading-none tracking-[-0.02em] text-fg-primary">
            $200
          </span>
          <p className="text-[13px] leading-[1.5] text-fg-secondary">
            Search across every live log — by artifact type, stack, library,
            exact symbol, design token, customer keyword. Pinpoint who&apos;s
            already shipped what you need.
          </p>
          <ul className="mb-1 flex flex-col gap-1.5 pt-1">
            <li className="font-mono text-[11px] text-[#333]">
              · &nbsp;Full-text + filter search across artifacts
            </li>
            <li className="font-mono text-[11px] text-[#333]">
              · &nbsp;Saved queries + email alerts
            </li>
            <li className="font-mono text-[11px] text-[#333]">
              · &nbsp;Includes monthly access tier
            </li>
          </ul>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-[13px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover"
          >
            Start Pro
          </button>
        </article>

        {/* Company */}
        <article className="flex flex-col gap-3 rounded-2xl bg-surface-inverse p-7">
          <span className="font-mono text-[10px] font-semibold tracking-[0.25em] text-accent">
            COMPANY · PILOT
          </span>
          <span className="font-display text-[42px] font-semibold leading-none tracking-[-0.02em] text-fg-inverse">
            Let&apos;s talk
          </span>
          <p className="text-[13px] leading-[1.5] text-fg-muted">
            Bulk access to all live cohorts. Filter by stack, role, location.
            We onboard you by hand on the first cohort.
          </p>
          <Link
            href="mailto:starknight@keepstar.one"
            className="mt-1 inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-[13px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover"
          >
            Book intro call
          </Link>
        </article>
      </div>
    </SectionWrap>
  );
}

/* -------------------------- FAQ -------------------------- */

const FAQS = [
  {
    q: "Can a team game the scoring?",
    a: "Yes, in theory. In practice 5/5 across the board flags as outlier and a human reviews. Long-term: cross-team peer reviews. The artifact is the actual evidence — scores are signal on top.",
  },
  {
    q: "What if I want a senior backend dev — not just any builder?",
    a: "Filter by self-tag distribution and artifact type. A backend-heavy log shows up as code-tagged entries with PR links — easy to spot. We help on the pilot.",
  },
  {
    q: "Do you do the interview for me?",
    a: "No — we replace the resume. You still talk to the human. The log is what gets you a 95%-confident shortlist before that call.",
  },
  {
    q: "What about NDA?",
    a: "You sign one when you unlock a paid log. It restricts copying and forwarding the actual artifacts. The pilot package includes a sane template; companies can use their own.",
  },
];

function FAQ() {
  return (
    <SectionWrap className="pb-20">
      <div className="rounded-2xl border border-border-base bg-surface-card px-7">
        <div className="flex items-center justify-between border-b border-border-base py-4">
          <h2 className="font-display text-xl font-semibold text-fg-primary">
            What hirers usually ask
          </h2>
          <span className="font-mono text-[11px] text-fg-muted">
            more in the docs →
          </span>
        </div>
        {FAQS.map((f, i) => (
          <div
            key={f.q}
            className={`flex flex-col gap-1.5 py-4 ${
              i < FAQS.length - 1 ? "border-b border-border-soft" : ""
            }`}
          >
            <h3 className="text-[14px] font-semibold text-fg-primary">
              {f.q}
            </h3>
            <p className="text-[13px] leading-[1.55] text-fg-secondary">
              {f.a}
            </p>
          </div>
        ))}
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
    <section className={`px-6 py-10 sm:px-12 md:px-20 ${className}`}>
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  );
}
