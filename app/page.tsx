"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";
import { PROJECTS as DATA_PROJECTS } from "@/lib/data";

type Tab = "projects" | "log";

export default function CohortPage() {
  const [tab, setTab] = useState<Tab>("projects");

  return (
    <>
      <LandingHeader current="feed" />
      <main className="bg-surface-primary">
        <Hero />
        <FeedSection tab={tab} onTab={setTab} />
      </main>
      <Footer />
    </>
  );
}

/* -------------------------- Hero -------------------------- */

function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 pb-10 pt-16 sm:px-12 md:px-20">
      <h1 className="text-center font-sans text-5xl font-bold leading-[1.05] tracking-[-0.035em] text-fg-primary sm:text-6xl md:text-[84px]">
        Can&apos;t find work?
        <br />
        Just create it.
      </h1>

      <SearchBar />

      <div className="mt-2 flex flex-col gap-3.5 sm:flex-row">
        <RoleButton kind="hire" />
        <RoleButton kind="build" />
      </div>
    </section>
  );
}

function SearchBar() {
  return (
    <div className="flex w-full max-w-[560px] items-center gap-2.5 rounded-full border border-border-base bg-surface-card px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <SearchIcon size={16} color="#999" />
      <input
        type="text"
        placeholder="Search teams, builders, skills…"
        className="flex-1 bg-transparent text-[14px] text-fg-primary outline-none placeholder:text-fg-muted"
      />
      <span className="rounded-md border border-border-base bg-surface-card-alt px-1.5 py-[3px] font-mono text-[11px] text-fg-muted">
        ⌘ K
      </span>
    </div>
  );
}

function RoleButton({ kind }: { kind: "hire" | "build" }) {
  if (kind === "hire") {
    return (
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
    );
  }
  return (
    <Link
      href="/apply"
      className="inline-flex items-center gap-2.5 rounded-full bg-accent px-[22px] py-[14px] text-[14px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover"
    >
      <HammerIcon />
      I&apos;m building
      <span className="font-mono text-[11px] font-normal text-[#FFE0B2]">
        join a team
      </span>
    </Link>
  );
}

/* -------------------------- Feed body -------------------------- */

function FeedSection({
  tab,
  onTab,
}: {
  tab: Tab;
  onTab: (t: Tab) => void;
}) {
  return (
    <section className="px-6 pb-20 sm:px-12 md:px-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between pb-4">
          <Tabs tab={tab} onTab={onTab} />
          <div className="flex items-center gap-3.5">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-fg-secondary">
                LIVE
              </span>
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-border-base px-3 py-1.5 font-mono text-[11px] text-fg-muted transition-colors hover:text-fg-primary"
            >
              <SearchIcon size={12} color="#999" />
              Filter
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pb-3">
          <div className="flex flex-wrap gap-1.5">
            {(tab === "projects" ? PROJECT_FILTERS : LOG_FILTERS).map(
              (f, i) => (
                <FilterChip key={f} active={i === 0}>
                  {f}
                </FilterChip>
              ),
            )}
          </div>
          <span className="hidden font-mono text-[11px] text-fg-muted sm:block">
            Sort: peer score
          </span>
        </div>

        {tab === "projects" ? <ProjectGrid /> : <ActivityLog />}

        <FeedFooter tab={tab} />
      </div>
    </section>
  );
}

function Tabs({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <div className="flex gap-1 rounded-full border border-border-base bg-surface-card-alt p-1">
      <TabButton
        active={tab === "projects"}
        onClick={() => onTab("projects")}
        icon={<GridIcon />}
        count="247"
      >
        Projects
      </TabButton>
      <TabButton
        active={tab === "log"}
        onClick={() => onTab("log")}
        icon={<ActivityIcon />}
        count="347 today"
      >
        Activity log
      </TabButton>
      <Link
        href="/how-it-works"
        className="rounded-full px-4 py-2 text-[13px] font-medium text-fg-secondary transition-colors hover:text-fg-primary"
      >
        How it works
      </Link>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  count: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
        active
          ? "bg-surface-inverse text-fg-inverse"
          : "text-fg-secondary hover:text-fg-primary"
      }`}
    >
      {icon}
      {children}
      <span className="font-mono text-[11px] font-normal text-fg-muted">
        {count}
      </span>
    </button>
  );
}

const PROJECT_FILTERS = [
  "All",
  "Hiring",
  "Stealth",
  "Looking for lead",
  "Public launch",
];
const LOG_FILTERS = ["All", "Code", "Design", "Research", "External"];

function FilterChip({
  active = false,
  children,
}: {
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
        active
          ? "border border-border-base bg-surface-card-alt font-semibold text-fg-primary"
          : "text-fg-secondary hover:text-fg-primary"
      }`}
    >
      {children}
    </button>
  );
}

/* -------------------------- Projects grid -------------------------- */

type ProjectCardData = {
  slug: string;
  initials: string;
  bg: string;
  fg: string;
  name: string;
  desc: string;
  badge: { text: string; tone: "filled" | "outline" };
  day: string;
  logs: string;
  rating: string;
};

const PROJECTS: ProjectCardData[] = DATA_PROJECTS.map((p) => ({
  slug: p.slug,
  initials: p.initials,
  bg: p.bg,
  fg: p.fg,
  name: p.name,
  desc: p.shortDesc,
  badge: p.badge,
  day: `Day ${p.status.daysIn}`,
  logs: `${p.entries} logs`,
  rating: p.rating,
}));

function ProjectGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {PROJECTS.map((p) => (
        <ProjectCard key={p.slug} p={p} />
      ))}
    </div>
  );
}

function ProjectCard({ p }: { p: ProjectCardData }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="flex flex-col gap-2.5 rounded-[10px] border border-border-base bg-surface-card-alt p-3.5 transition-colors hover:bg-surface-card hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <header className="flex items-center justify-between">
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg font-mono text-[11px] font-semibold"
          style={{ backgroundColor: p.bg, color: p.fg }}
        >
          {p.initials}
        </span>
        {p.badge.tone === "filled" ? (
          <span className="rounded-full bg-accent px-2 py-[3px] font-mono text-[9px] font-semibold tracking-[0.1em] text-fg-inverse">
            {p.badge.text}
          </span>
        ) : (
          <span className="rounded-full border border-fg-muted bg-surface-card px-2 py-[3px] font-mono text-[9px] font-semibold tracking-[0.1em] text-fg-secondary">
            {p.badge.text}
          </span>
        )}
      </header>

      <h3 className="font-sans text-[15px] font-semibold text-fg-primary">
        {p.name}
      </h3>
      <p className="text-[12px] leading-[1.4] text-fg-secondary">{p.desc}</p>

      <div className="mt-1 flex items-center gap-3.5 border-t border-border-base pt-2 font-mono text-[11px] text-fg-secondary">
        <span>{p.day}</span>
        <span>{p.logs}</span>
        <span className="font-semibold text-accent">{p.rating}</span>
      </div>
    </Link>
  );
}

/* -------------------------- Activity log -------------------------- */

type LogEntry = {
  time: string;
  type: "code" | "call" | "design" | "doc" | "data";
  team: string;
  teamSlug?: string;
  who: string;
  whoHandle?: string;
  did: string;
  meta: string;
};

const TYPE_COLORS: Record<
  LogEntry["type"],
  { bg: string; fg: string; icon: ReactNode }
> = {
  code: { bg: "#FFE0B2", fg: "#E65100", icon: <PRIcon /> },
  call: { bg: "#E1BEE7", fg: "#7B1FA2", icon: <PhoneIcon /> },
  design: { bg: "#C8E6C9", fg: "#2E7D32", icon: <FigmaIcon /> },
  doc: { bg: "#FFCDD2", fg: "#C62828", icon: <PencilIcon /> },
  data: { bg: "#BBDEFB", fg: "#1565C0", icon: <CommitIcon /> },
};

const LOG_ENTRIES: LogEntry[] = [
  { time: "2m", type: "code", team: "HireMatch AI", teamSlug: "hirematch-ai", who: "Sasha K.", whoHandle: "sasha-k", did: "pushed 13 commits — match scoring v2 endpoint", meta: "3h · PR #142" },
  { time: "5m", type: "call", team: "TeamPulse", teamSlug: "teampulse", who: "Aya S.", whoHandle: "aya-s", did: "finished 5 user interviews — async standup pain validated", meta: "4h · 5 transcripts" },
  { time: "12m", type: "design", team: "HireMatch AI", teamSlug: "hirematch-ai", who: "Lila P.", whoHandle: "lila-p", did: "shipped 4 new screens — onboarding, profile, match, settings", meta: "5h · Figma" },
  { time: "21m", type: "doc", team: "DealRoom", teamSlug: "dealroom", who: "Sasha K.", whoHandle: "sasha-k", did: "drafted dashboard wireframe — pipeline view, deal stages", meta: "2h · Excalidraw" },
  { time: "38m", type: "data", team: "TeamPulse", teamSlug: "teampulse", who: "Marcus R.", whoHandle: "marcus-r", did: "migrated DB to Postgres — auth + sessions tables live", meta: "6h · commit a4f81" },
  { time: "54m", type: "code", team: "SkillStack", teamSlug: "skillstack", who: "Lila P.", whoHandle: "lila-p", did: "validated SkillStack idea with 30 survey responses", meta: "3h · 30 responses" },
  { time: "1h", type: "call", team: "QuietHire", teamSlug: "quiethire", who: "Dima J.", whoHandle: "dima-j", did: "posted spec doc — sync engine v1, conflict resolution", meta: "4h · Notion" },
  { time: "1h", type: "design", team: "DealRoom", teamSlug: "dealroom", who: "Marcus R.", whoHandle: "marcus-r", did: "peer-reviewed teammate's PR — 2 blockers raised, 1 resolved", meta: "45m · review" },
  { time: "2h", type: "doc", team: "Team #42", teamSlug: "team-42", who: "Anonymous", did: "sent 18 cold emails — 3 demo bookings on the calendar", meta: "2h · external" },
  { time: "3h", type: "data", team: "HireMatch AI", teamSlug: "hirematch-ai", who: "Aya S.", whoHandle: "aya-s", did: "deployed v0.4 to staging — embedding cache hit rate 94%", meta: "5h · deploy log" },
];

function ActivityLog() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-border-base bg-surface-card">
      {LOG_ENTRIES.map((e, i) => (
        <LogRow key={i} entry={e} last={i === LOG_ENTRIES.length - 1} />
      ))}
    </div>
  );
}

function LogRow({ entry: e, last }: { entry: LogEntry; last: boolean }) {
  const c = TYPE_COLORS[e.type];
  return (
    <div
      className={`flex items-center gap-3.5 px-4 py-3 sm:px-[18px] ${
        last ? "" : "border-b border-border-base"
      }`}
    >
      <span className="w-9 text-right font-mono text-[11px] text-fg-muted">
        {e.time}
      </span>
      <span
        className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full"
        style={{ backgroundColor: c.bg, color: c.fg }}
      >
        {c.icon}
      </span>
      {e.teamSlug ? (
        <Link
          href={`/projects/${e.teamSlug}`}
          className="hidden w-[140px] flex-none truncate font-sans text-[13px] font-semibold text-fg-primary hover:underline md:block"
        >
          {e.team}
        </Link>
      ) : (
        <span className="hidden w-[140px] flex-none truncate font-sans text-[13px] font-semibold text-fg-primary md:block">
          {e.team}
        </span>
      )}
      {e.whoHandle ? (
        <Link
          href={`/u/${e.whoHandle}`}
          className="hidden w-[100px] flex-none truncate text-[13px] text-fg-secondary hover:text-fg-primary md:block"
        >
          {e.who}
        </Link>
      ) : (
        <span className="hidden w-[100px] flex-none truncate text-[13px] text-fg-secondary md:block">
          {e.who}
        </span>
      )}
      <span className="flex-1 truncate text-[13px] text-fg-primary">
        {e.did}
      </span>
      <span className="hidden w-[120px] flex-none text-right font-mono text-[11px] text-fg-muted md:block">
        {e.meta}
      </span>
    </div>
  );
}

function FeedFooter({ tab }: { tab: Tab }) {
  return (
    <div className="flex items-center justify-between pt-4">
      <span className="font-mono text-[11px] text-fg-muted">
        {tab === "projects"
          ? "Showing 10 of 247 projects"
          : "Showing 10 of 347 entries today"}
      </span>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent hover:text-accent-hover"
      >
        {tab === "projects" ? "Expand" : "See all"}
        <ChevronIcon dir={tab === "projects" ? "down" : "right"} />
      </button>
    </div>
  );
}

/* -------------------------- Icons -------------------------- */

function SearchIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
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

function PRIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" />
      <line x1="6" y1="9" x2="6" y2="21" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function FigmaIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5Z" />
      <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2Z" />
      <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0Z" />
      <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0Z" />
      <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5Z" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function CommitIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <line x1="3" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="21" y2="12" />
    </svg>
  );
}

function ChevronIcon({ dir }: { dir: "down" | "right" }) {
  if (dir === "right") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
