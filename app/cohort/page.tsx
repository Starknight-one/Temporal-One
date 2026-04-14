import type { Metadata } from "next";
import Link from "next/link";
import { SubpageHeader } from "@/components/SubpageHeader";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Live Cohort — Temporal One",
  description:
    "Real teams. Real projects. Real deadlines. See what's shipping right now in the current cohort.",
};

type Project = {
  slug: string | null;
  name: string;
  description: string;
  week: string;
  weekAccent: boolean;
  progress: number;
  team: { initials: string; color: string }[];
  openSpots?: number;
};

const PROJECTS: Project[] = [
  {
    slug: "hirematch-ai",
    name: "HireMatch AI",
    description:
      "AI-powered job matching — skills analysis, culture fit, and career trajectory matching.",
    week: "Week 3",
    weekAccent: true,
    progress: 50,
    team: [
      { initials: "SK", color: "#2D5A27" },
      { initials: "MR", color: "#4A2D6F" },
      { initials: "LP", color: "#6F4A2D" },
      { initials: "DJ", color: "#2D4A6F" },
    ],
  },
  {
    slug: null,
    name: "TeamPulse",
    description:
      "Async standups, pulse checks, and blockers tracking for remote teams — without meeting fatigue.",
    week: "Week 3",
    weekAccent: true,
    progress: 50,
    team: [
      { initials: "AT", color: "#6F2D4A" },
      { initials: "RW", color: "#2D6F5A" },
      { initials: "EL", color: "#5A2D6F" },
      { initials: "JC", color: "#4A6F2D" },
    ],
  },
  {
    slug: null,
    name: "SkillStack",
    description:
      "Interactive portfolio builder — turn shipped work into live case studies with demos and impact metrics.",
    week: "Week 1",
    weekAccent: false,
    progress: 15,
    team: [
      { initials: "KM", color: "#6F5A2D" },
      { initials: "NV", color: "#2D4A6F" },
      { initials: "OB", color: "#4A2D5A" },
    ],
    openSpots: 1,
  },
];

type ActivityItem = {
  time: string;
  initials: string;
  color: string;
  title: string;
  detail: string;
};

const ACTIVITY: ActivityItem[] = [
  {
    time: "2h ago",
    initials: "SK",
    color: "#2D5A27",
    title: "Sarah K. pushed 12 commits to HireMatch AI",
    detail:
      "Implemented candidate scoring algorithm and added skills taxonomy API endpoint",
  },
  {
    time: "5h ago",
    initials: "AT",
    color: "#6F2D4A",
    title: "Ana T. completed sprint task: Auth flow",
    detail: "Full OAuth2 + magic link login for TeamPulse. Deployed to staging.",
  },
  {
    time: "8h ago",
    initials: "LP",
    color: "#6F4A2D",
    title: "Lisa P. shared 8 new screens for HireMatch AI",
    detail:
      "Candidate dashboard, job detail cards, and matching results flow. Team approved in standup.",
  },
  {
    time: "1d ago",
    initials: "RW",
    color: "#2D6F5A",
    title: "Ryan W. ran first user interviews for TeamPulse",
    detail:
      "5 interviews with remote team leads. Key insight: managers want async pulse, not another dashboard.",
  },
  {
    time: "1d ago",
    initials: "KM",
    color: "#6F5A2D",
    title: "Kai M. validated SkillStack idea with 30 survey responses",
    detail:
      "82% of respondents said their portfolio doesn't reflect their actual skills. Proceeding to build.",
  },
  {
    time: "2d ago",
    initials: "MR",
    color: "#4A2D6F",
    title: "Marcus R. deployed HireMatch API to production",
    detail:
      "REST API with 14 endpoints live. Skills matching endpoint returning results in <200ms.",
  },
  {
    time: "3d ago",
    initials: "DJ",
    color: "#2D4A6F",
    title: "David J. published HireMatch roadmap for Weeks 4–5",
    detail:
      "Focus: employer dashboard, bulk matching, and onboarding flow. Demo day target: 50 active users.",
  },
];

export default function CohortPage() {
  return (
    <>
      <SubpageHeader />
      <main className="bg-surface-primary">
        {/* Hero */}
        <section className="flex flex-col items-center gap-6 px-6 pb-16 pt-20 text-center sm:px-12 md:px-20 md:pt-28 md:pb-20">
          <span className="font-mono text-[13px] uppercase tracking-[0.25em] text-accent">
            Live Cohort
          </span>
          <h1 className="font-display text-5xl uppercase leading-[0.95] sm:text-6xl md:text-7xl lg:text-[88px]">
            The build
            <br />
            in progress.
          </h1>
          <p className="max-w-xl text-base leading-[1.6] text-fg-secondary sm:text-lg">
            Real teams. Real projects. Real deadlines. Here&apos;s what&apos;s
            happening right now in the current cohort.
          </p>
        </section>

        {/* Main content grid */}
        <section className="px-6 pb-20 sm:px-12 md:px-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[420px_1fr] lg:gap-8">
            {/* Projects column */}
            <div className="flex flex-col gap-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-secondary">
                Active projects
              </span>
              <div className="flex flex-col gap-6">
                {PROJECTS.map((p) => (
                  <ProjectCard key={p.name} project={p} />
                ))}
              </div>
            </div>

            {/* Activity column */}
            <div className="flex flex-col gap-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-secondary">
                Activity feed
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
                    <Avatar initials={a.initials} color={a.color} size={32} />
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
          </div>
        </section>

        {/* CTA */}
        <section className="bg-surface-card px-6 py-24 sm:px-12 md:px-20 md:py-28">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2 className="font-display text-4xl uppercase leading-[0.95] sm:text-5xl md:text-6xl">
              This could be
              <br />
              your feed.
            </h2>
            <p className="text-base text-fg-secondary sm:text-lg">
              3 projects shipping. 11 builders moving. 7 spots left.
            </p>
            <Link
              href="/apply"
              className="mt-2 inline-flex h-14 items-center justify-center rounded-sm bg-accent px-12 text-base font-semibold text-fg-inverse transition-colors hover:bg-accent-hover"
            >
              Start building today
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const card = (
    <div className="flex flex-col gap-5 border border-border-base bg-surface-card p-7 transition-colors hover:border-fg-secondary">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-fg-primary">{p.name}</h3>
        <span
          className={`inline-flex items-center gap-1.5 border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${
            p.weekAccent
              ? "border-accent text-accent"
              : "border-fg-secondary text-fg-secondary"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              p.weekAccent ? "bg-accent" : "bg-fg-secondary"
            }`}
          />
          {p.week}
        </span>
      </div>
      <p className="text-sm leading-[1.5] text-fg-secondary">{p.description}</p>
      <div className="h-[3px] overflow-hidden rounded-sm bg-border-base">
        <div
          className={`h-full rounded-sm ${
            p.weekAccent ? "bg-accent" : "bg-fg-secondary"
          }`}
          style={{ width: `${p.progress}%` }}
        />
      </div>
      <div className="flex items-center gap-2">
        {p.team.map((m) => (
          <Avatar
            key={m.initials}
            initials={m.initials}
            color={m.color}
            size={28}
          />
        ))}
        {p.openSpots ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-fg-secondary text-[10px] text-fg-secondary">
            +{p.openSpots}
          </span>
        ) : null}
        <span
          className={`ml-2 font-mono text-[10px] uppercase tracking-[0.1em] ${
            p.openSpots ? "text-accent" : "text-fg-secondary"
          }`}
        >
          {p.openSpots
            ? `${p.team.length} builders · ${p.openSpots} open`
            : `${p.team.length} builders`}
        </span>
      </div>
    </div>
  );

  return p.slug ? <Link href={`/projects/${p.slug}`}>{card}</Link> : card;
}

function Avatar({
  initials,
  color,
  size,
}: {
  initials: string;
  color: string;
  size: number;
}) {
  return (
    <span
      className="flex items-center justify-center rounded-full font-semibold text-fg-primary"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size < 30 ? 9 : 10,
      }}
    >
      {initials}
    </span>
  );
}
