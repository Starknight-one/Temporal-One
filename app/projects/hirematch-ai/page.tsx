import type { Metadata } from "next";
import Link from "next/link";
import { SubpageHeader } from "@/components/SubpageHeader";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "HireMatch AI — Temporal One",
  description:
    "AI-powered job matching platform analyzing skills, culture fit, and career trajectory. A Temporal One cohort project.",
};

const TEAM = [
  {
    initials: "SK",
    color: "#2D5A27",
    name: "Sarah K.",
    role: "Senior Frontend Engineer · Ex-Stripe, Meta",
    lead: true,
  },
  {
    initials: "MR",
    color: "#4A2D6F",
    name: "Marcus R.",
    role: "Backend Engineer · Ex-Shopify",
    lead: false,
  },
  {
    initials: "LP",
    color: "#6F4A2D",
    name: "Lisa P.",
    role: "Product Designer · Ex-Figma, Airbnb",
    lead: false,
  },
  {
    initials: "DJ",
    color: "#2D4A6F",
    name: "David J.",
    role: "Product Manager · Ex-Google, Uber",
    lead: false,
  },
];

const METRICS = [
  { value: "14", label: "API Endpoints" },
  { value: "47", label: "Commits" },
  { value: "12", label: "User Tests" },
];

const TECH = ["React", "TypeScript", "Python", "Django", "PostgreSQL", "OpenAI"];

const ACTIVITY = [
  {
    time: "2h ago",
    initials: "SK",
    color: "#2D5A27",
    title: "Sarah K. pushed 12 commits",
    detail:
      "Implemented candidate scoring algorithm and added skills taxonomy API endpoint. Matching accuracy improved to 84%.",
  },
  {
    time: "8h ago",
    initials: "LP",
    color: "#6F4A2D",
    title: "Lisa P. shared 8 new screens",
    detail:
      "Candidate dashboard, job detail cards, and matching results flow. Team approved all screens in standup.",
  },
  {
    time: "1d ago",
    initials: "MR",
    color: "#4A2D6F",
    title: "Marcus R. deployed REST API to production",
    detail:
      "14 endpoints live. Skills matching returning results in <200ms. Auth flow integrated with frontend.",
  },
  {
    time: "2d ago",
    initials: "DJ",
    color: "#2D4A6F",
    title: "David J. published roadmap for Weeks 4–5",
    detail:
      "Focus: employer dashboard, bulk matching, onboarding flow. Demo day target: 50 active users signed up.",
  },
  {
    time: "3d ago",
    initials: "SK",
    color: "#2D5A27",
    title: "Sarah K. ran 5 user interviews with recruiters",
    detail:
      "Key insight: recruiters spend 40% of time on initial screening. They want AI to handle first pass, not replace final decisions.",
  },
];

const MILESTONES = [
  { week: "Week 1", status: "Validated ✓", done: true, active: false },
  { week: "Weeks 2–4", status: "Building MVP", done: false, active: true },
  { week: "Week 5", status: "Launch", done: false, active: false },
  { week: "Week 6", status: "Demo Day", done: false, active: false },
];

export default function HireMatchAIPage() {
  return (
    <>
      <SubpageHeader />
      <main className="bg-surface-primary">
        {/* Hero */}
        <section className="px-6 pb-10 pt-16 sm:px-12 md:px-20 md:pb-10 md:pt-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between md:gap-16">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center border border-accent px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    AI / Recruitment
                  </span>
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent"
                    style={{ backgroundColor: "#1A2E0A" }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Week 3 — Building MVP
                  </span>
                </div>
                <h1 className="font-display text-5xl uppercase leading-[0.95] sm:text-6xl md:text-7xl">
                  HireMatch AI
                </h1>
                <p className="max-w-2xl text-base leading-[1.6] text-fg-secondary sm:text-lg">
                  An AI-powered job matching platform that analyzes skills,
                  culture fit, and career trajectory to connect candidates
                  with roles they&apos;d actually thrive in — not just keyword
                  matches.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 md:items-end">
                <MetaRow
                  label="Started"
                  value="March 4, 2026"
                  valueClass="text-fg-primary"
                />
                <MetaRow
                  label="Demo Day"
                  value="April 14, 2026"
                  valueClass="text-accent font-semibold"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Progress */}
        <section className="px-6 pb-10 sm:px-12 md:px-20 md:pb-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-secondary">
              Sprint progress
            </span>
            <div className="h-1.5 w-full overflow-hidden rounded-sm bg-border-base">
              <div
                className="h-full rounded-sm bg-accent"
                style={{ width: "50%" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {MILESTONES.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-1 ${
                    i === MILESTONES.length - 1
                      ? "sm:items-end"
                      : i === 0
                      ? "sm:items-start"
                      : "sm:items-center"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.15em] ${
                      m.active ? "text-fg-primary" : "text-fg-secondary"
                    }`}
                  >
                    {m.week}
                  </span>
                  <span
                    className={`text-xs ${
                      m.done || m.active ? "text-accent" : "text-fg-secondary"
                    } ${m.active ? "font-semibold" : ""}`}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="border-t border-border-base" />

        {/* Main columns */}
        <section className="px-6 py-12 sm:px-12 md:px-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[400px_1fr]">
            {/* Team column */}
            <div className="flex flex-col gap-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-secondary">
                The team
              </span>
              <div className="flex flex-col gap-5">
                {TEAM.map((m) => (
                  <div
                    key={m.initials}
                    className="flex items-center gap-4 border border-border-base bg-surface-card p-5"
                  >
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-fg-primary"
                      style={{ backgroundColor: m.color }}
                    >
                      {m.initials}
                    </span>
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-base font-semibold text-fg-primary">
                        {m.name}
                      </span>
                      <span className="text-[13px] text-fg-secondary">
                        {m.role}
                      </span>
                    </div>
                    {m.lead && (
                      <span className="border border-accent px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-accent">
                        Lead
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Detail column */}
            <div className="flex flex-col gap-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-secondary">
                About the project
              </span>
              <InfoBox label="The Problem">
                Job boards match keywords, not people. A senior engineer with
                8 years of React experience gets the same results as a
                bootcamp grad who listed React on their resume. Recruiters
                spend hours filtering. Candidates send 300 applications and
                hear nothing back. The matching is broken.
              </InfoBox>
              <InfoBox label="The Solution">
                HireMatch AI analyzes actual work history, project
                complexity, team dynamics, and growth trajectory — not just
                keywords. It scores candidates on culture fit, skill depth,
                and career alignment. Recruiters get a shortlist of 5 instead
                of 500. Candidates get roles they&apos;d actually thrive in.
              </InfoBox>

              <div className="grid gap-4 sm:grid-cols-3">
                {METRICS.map((m) => (
                  <div
                    key={m.label}
                    className="flex flex-col items-center gap-2 border border-border-base bg-surface-card p-6"
                  >
                    <span className="font-display text-4xl leading-none text-accent">
                      {m.value}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-secondary">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 border border-border-base bg-surface-card p-7">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                  Tech stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {TECH.map((t) => (
                    <span
                      key={t}
                      className="border border-border-base bg-surface-primary px-3.5 py-1.5 text-xs text-fg-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-border-base" />

        {/* Recent activity */}
        <section className="px-6 py-12 sm:px-12 md:px-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-secondary">
              Recent activity
            </span>
            <ol className="flex flex-col">
              {ACTIVITY.map((a, i) => (
                <li
                  key={i}
                  className={`grid gap-4 py-5 sm:grid-cols-[70px_32px_1fr] ${
                    i < ACTIVITY.length - 1
                      ? "border-b border-border-base"
                      : ""
                  }`}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg-secondary">
                    {a.time}
                  </span>
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold text-fg-primary"
                    style={{ backgroundColor: a.color }}
                  >
                    {a.initials}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm text-fg-primary">{a.title}</p>
                    <p className="text-[13px] leading-[1.5] text-fg-secondary">
                      {a.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-surface-card px-6 py-20 sm:px-12 md:px-20 md:py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <h2 className="font-display text-3xl uppercase leading-[0.95] sm:text-4xl md:text-5xl">
              Want to build
              <br />
              something like this?
            </h2>
            <p className="text-base text-fg-secondary sm:text-lg">
              Join the next cohort. Pick a project. Ship in 6 weeks.
            </p>
            <Link
              href="/apply"
              className="mt-2 inline-flex h-14 items-center justify-center rounded-sm bg-accent px-12 text-base font-semibold text-fg-inverse transition-colors hover:bg-accent-hover"
            >
              Apply for a spot
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function InfoBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border border-border-base bg-surface-card p-7">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
        {label}
      </span>
      <p className="text-[15px] leading-[1.7] text-fg-secondary">{children}</p>
    </div>
  );
}

function MetaRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div className="flex flex-col gap-1 md:items-end">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-secondary">
        {label}
      </span>
      <span className={`text-base ${valueClass}`}>{value}</span>
    </div>
  );
}
