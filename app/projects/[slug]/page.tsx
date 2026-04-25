import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";
import {
  PROJECTS,
  type Project,
  type ProjectStatusKind,
  getProject,
  getTeamBuilders,
} from "@/lib/data";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project — Temporal One" };
  return {
    title: `${p.name} — Temporal One`,
    description: p.longDesc,
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const team = getTeamBuilders(project);

  return (
    <>
      <LandingHeader current="feed" />
      <main className="bg-surface-primary">
        <Crumbs slug={project.slug} />
        <Hero project={project} />
        <Stats project={project} />
        <TeamCard project={project} team={team} />
        <ActivityLog project={project} />
      </main>
      <Footer />
    </>
  );
}

/* -------------------------- Crumbs -------------------------- */

function Crumbs({ slug }: { slug: string }) {
  return (
    <div className="px-6 pt-6 sm:px-12 md:px-20">
      <div className="mx-auto flex max-w-[1200px] items-center gap-2 font-mono text-[11px]">
        <Link href="/" className="text-fg-muted hover:text-fg-primary">
          Feed
        </Link>
        <span className="text-[#CCC]">/</span>
        <Link href="/" className="text-fg-muted hover:text-fg-primary">
          Projects
        </Link>
        <span className="text-[#CCC]">/</span>
        <span className="font-semibold text-fg-primary">{slug}</span>
      </div>
    </div>
  );
}

/* -------------------------- Hero -------------------------- */

function Hero({ project }: { project: Project }) {
  return (
    <section className="px-6 pb-2 pt-5 sm:px-12 md:px-20">
      <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-3.5 py-2">
          <div className="flex items-start gap-3">
            <span
              className="flex h-16 w-16 flex-none items-center justify-center rounded-xl border"
              style={{
                backgroundColor: lighten(project.bg),
                borderColor: project.bg,
                color: project.fg,
              }}
            >
              <SparklesIcon size={28} />
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <StatusPill status={project.status} />
                <span className="font-mono text-[11px] text-fg-muted">
                  {project.slug}
                </span>
              </div>
              <h1 className="font-display text-3xl font-semibold leading-tight tracking-[-0.01em] text-fg-primary sm:text-[36px]">
                {project.name}
              </h1>
            </div>
          </div>
          <p className="max-w-[640px] text-[15px] leading-[1.5] text-fg-secondary">
            {project.longDesc}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-2.5 py-2">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-inverse px-5 py-3.5 text-[14px] font-semibold text-fg-inverse hover:opacity-90"
          >
            <LockOpenIcon />
            Unlock full project log — $500
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-surface-card px-5 py-3.5 text-[14px] font-semibold text-fg-primary hover:bg-surface-card-alt"
          >
            Subscribe Pro · $200/mo
          </button>
          <p className="text-center font-mono text-[11px] text-fg-muted">
            Public preview shows the latest 15 entries.
          </p>
        </aside>
      </div>
    </section>
  );
}

function StatusPill({
  status,
}: {
  status: { kind: ProjectStatusKind; daysIn: number; totalDays: number };
}) {
  const m = STATUS_META[status.kind];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.2em]"
      style={{
        backgroundColor: m.bg,
        color: m.fg,
        border: `1px solid ${m.border}`,
      }}
    >
      {m.label} · DAY {status.daysIn}/{status.totalDays}
    </span>
  );
}

const STATUS_META: Record<
  ProjectStatusKind,
  { label: string; bg: string; fg: string; border: string }
> = {
  live: { label: "LIVE", bg: "#F0F9E8", fg: "#3D7B0E", border: "#D9F0BE" },
  hiring: { label: "HIRING", bg: "#FFF4E5", fg: "#9E5B00", border: "#FFD9A8" },
  stealth: { label: "STEALTH", bg: "#FAFAF7", fg: "#666666", border: "#EEEEEE" },
  launch: { label: "LAUNCH", bg: "#FFF4E5", fg: "#9E5B00", border: "#FFD9A8" },
  open: { label: "OPEN", bg: "#FFF4E5", fg: "#9E5B00", border: "#FFD9A8" },
  lead: { label: "LEAD?", bg: "#FAFAF7", fg: "#666666", border: "#EEEEEE" },
  beta: { label: "BETA", bg: "#FFF4E5", fg: "#9E5B00", border: "#FFD9A8" },
};

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border-base bg-surface-card-alt px-2.5 py-[5px] font-mono text-[11px] text-fg-secondary">
      {children}
    </span>
  );
}

/* -------------------------- Stats -------------------------- */

function Stats({ project }: { project: Project }) {
  const cells = [
    { label: "TEAM", value: `${project.team.length} builders` },
    { label: "ENTRIES", value: `${project.entries} logged` },
    { label: "MRR", value: project.mrr },
  ];
  return (
    <SectionWrap>
      <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-border-base bg-surface-card">
        {cells.map((c, i) => (
          <div
            key={c.label}
            className={`flex flex-col gap-1.5 px-6 py-5 ${
              i < cells.length - 1 ? "border-r border-border-base" : ""
            }`}
          >
            <span className="font-mono text-[10px] tracking-[0.2em] text-fg-muted">
              {c.label}
            </span>
            <span className="font-display text-[22px] font-semibold leading-none text-fg-primary">
              {c.value}
            </span>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

/* -------------------------- Team -------------------------- */

function TeamCard({
  project,
  team,
}: {
  project: Project;
  team: ReturnType<typeof getTeamBuilders>;
}) {
  if (team.length === 0) return null;
  return (
    <SectionWrap>
      <div className="flex flex-col gap-3.5 rounded-2xl border border-border-base bg-surface-card px-6 py-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-fg-primary">
            {project.name === "Team #42" ? "Team" : `Team`}
          </h2>
          <span className="font-mono text-[11px] text-fg-muted">
            {team.length} builders · click any to see profile
          </span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {team.map((m) => (
            <Link
              key={m.handle}
              href={`/u/${m.handle}`}
              className="flex items-center gap-2.5 rounded-xl border border-border-base bg-surface-card-alt px-3.5 py-2.5 transition-colors hover:bg-surface-card"
            >
              <span
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[12px] font-semibold text-fg-inverse"
                style={{ backgroundColor: m.avatarBg }}
              >
                {m.initials}
              </span>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-fg-primary">
                  {m.name}
                </span>
                <span className="font-mono text-[10px] text-fg-muted">
                  {m.roleOverride ?? m.role}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

/* -------------------------- Activity log -------------------------- */

function ActivityLog({ project }: { project: Project }) {
  const remaining = Math.max(0, project.entries - project.log.length);
  return (
    <SectionWrap className="pb-8">
      <div className="overflow-hidden rounded-2xl border border-border-base bg-surface-card">
        <div className="flex items-center justify-between border-b border-border-base px-6 py-4">
          <div className="flex items-center gap-3.5">
            <h2 className="font-display text-lg font-semibold text-fg-primary">
              Activity log
            </h2>
            <span className="font-mono text-[11px] text-fg-muted">
              {project.log.length} of {project.entries} visible
            </span>
          </div>
          <div className="hidden gap-2 sm:flex">
            {(["All", "Code", "Design", "Doc", "Talk"] as const).map((f, i) => (
              <FilterChip key={f} active={i === 0}>
                {f}
              </FilterChip>
            ))}
          </div>
        </div>

        <ColumnHead variant="project" />

        {project.log.map((row, i) => (
          <ProjectLogRow
            key={i}
            row={row}
            authorName={lookupName(row.authorHandle)}
          />
        ))}

        <BlurredRow opacity={0.4} />
        <BlurredRow opacity={0.18} />

        <PaywallBox remaining={remaining} />
      </div>
    </SectionWrap>
  );
}

function ProjectLogRow({
  row,
  authorName,
}: {
  row: { day: number; authorHandle: string; text: string; scores: string };
  authorName: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border-soft px-6 py-3">
      <span className="w-[50px] flex-none font-mono text-[12px] text-fg-muted">
        d{row.day}
      </span>
      <Link
        href={`/u/${row.authorHandle}`}
        className="hidden w-[140px] flex-none truncate text-[13px] font-semibold text-fg-primary hover:underline md:block"
      >
        {authorName}
      </Link>
      <span className="flex-1 truncate text-[13px] text-[#333]">{row.text}</span>
      <span className="hidden w-[130px] flex-none text-right font-mono text-[11px] font-semibold text-[#3D7B0E] md:block">
        {row.scores}
      </span>
    </div>
  );
}

function ColumnHead({ variant }: { variant: "project" | "builder" }) {
  if (variant === "project") {
    return (
      <div className="flex items-center gap-3 border-b border-border-soft bg-[#FCFCFC] px-6 py-2.5">
        <ColLabel className="w-[50px]">DAY</ColLabel>
        <ColLabel className="hidden w-[140px] md:block">AUTHOR</ColLabel>
        <ColLabel className="flex-1">WHAT · ARTIFACT</ColLabel>
        <ColLabel className="hidden w-[130px] text-right md:block">
          SCORES
        </ColLabel>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 border-b border-border-soft bg-[#FCFCFC] px-6 py-2.5">
      <ColLabel className="w-[50px]">DAY</ColLabel>
      <ColLabel className="flex-1">WHAT · ARTIFACT</ColLabel>
      <ColLabel className="hidden w-[80px] md:block">TIME</ColLabel>
      <ColLabel className="hidden w-[130px] text-right md:block">
        SCORES
      </ColLabel>
    </div>
  );
}

function ColLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-[10px] tracking-[0.2em] text-fg-muted ${className}`}
    >
      {children}
    </span>
  );
}

function BlurredRow({ opacity }: { opacity: number }) {
  return (
    <div
      className="flex items-center gap-3 border-b border-border-soft px-6 py-3"
      style={{ opacity }}
      aria-hidden
    >
      <span className="w-[50px] flex-none font-mono text-[12px] text-[#CCC]">
        d12
      </span>
      <span className="hidden w-[140px] flex-none truncate text-[13px] font-semibold text-[#E5E5E5] md:block">
        ████████
      </span>
      <span className="flex-1 truncate text-[13px] text-[#E5E5E5]">
        ████████ ████████ ████████ ████████ ████ ████████ · ████
      </span>
      <span className="hidden w-[130px] flex-none text-right font-mono text-[11px] font-semibold text-[#E5E5E5] md:block">
        █.█ / █.█
      </span>
    </div>
  );
}

function PaywallBox({ remaining }: { remaining: number }) {
  return (
    <div className="flex flex-col items-center gap-3.5 border-t border-border-base bg-surface-card-alt px-6 py-7 text-center">
      <LockIcon size={24} />
      <h3 className="max-w-[640px] font-display text-2xl font-semibold tracking-[-0.01em] text-fg-primary">
        {remaining} more entries — 30 days of verified work
      </h3>
      <p className="max-w-[560px] text-[14px] text-fg-secondary">
        Full text · all artifacts · per-entry comments · who scored what.
      </p>
      <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-surface-inverse px-5 py-3 text-[13px] font-semibold text-fg-inverse hover:opacity-90"
        >
          Unlock this project — $500
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-[13px] font-semibold text-fg-inverse hover:bg-accent-hover"
        >
          Subscribe Pro — $200/mo
        </button>
      </div>
      <p className="font-mono text-[11px] text-fg-muted">
        Pro includes unlimited reads + artifact-search across all live projects.
      </p>
    </div>
  );
}

/* -------------------------- Shared helpers -------------------------- */

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
      className={`inline-flex items-center rounded-full px-3 py-[5px] font-mono text-[11px] transition-colors ${
        active
          ? "bg-surface-inverse font-semibold text-fg-inverse"
          : "border border-border-base bg-surface-card-alt text-fg-secondary hover:text-fg-primary"
      }`}
    >
      {children}
    </button>
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
    <section className={`px-6 py-4 sm:px-12 md:px-20 ${className}`}>
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  );
}

function lighten(hex: string) {
  // For our palette, the bg already lightens vs fg; this returns a paler version
  return hex + "AA";
}

function lookupName(handle: string): string {
  const map: Record<string, string> = {
    "sasha-k": "Sasha K.",
    "aya-s": "Aya S.",
    "marcus-r": "Marcus R.",
    "lila-p": "Lila P.",
    "dima-j": "Dima J.",
  };
  return map[handle] ?? handle;
}

/* -------------------------- Icons -------------------------- */

function SparklesIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3 13.9 8.1 19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z" />
      <path d="M19 3v4" />
      <path d="M21 5h-4" />
      <path d="M5 17v4" />
      <path d="M7 19H3" />
    </svg>
  );
}

function LockOpenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

function LockIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
