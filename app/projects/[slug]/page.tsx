import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";
import { InterestButton } from "@/components/InterestModal";
import {
  PROJECTS,
  type Project,
  type ProjectStatusKind,
  getProject,
  getTeamBuilders,
} from "@/lib/data";
import { ActivityLogCard } from "./ActivityLogCard";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project — Temporal One" };
  return { title: `${p.name} — Temporal One`, description: p.longDesc };
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
        <SectionWrap className="pb-8">
          <ActivityLogCard
            log={project.log}
            totalEntries={project.entries}
            slug={project.slug}
            projectName={project.name}
          />
        </SectionWrap>
      </main>
      <Footer />
    </>
  );
}

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

function Hero({ project }: { project: Project }) {
  return (
    <section className="px-6 pb-2 pt-5 sm:px-12 md:px-20">
      <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-3.5 py-2">
          <div className="flex items-start gap-3">
            <span
              className="flex h-16 w-16 flex-none items-center justify-center rounded-xl border"
              style={{
                backgroundColor: project.bg + "AA",
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
          <InterestButton
            intent="unlock-project"
            target={`${project.slug} · ${project.name}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-inverse px-5 py-3.5 text-[14px] font-semibold text-fg-inverse hover:opacity-90"
          >
            <LockOpenIcon />
            Unlock full project log — $500
          </InterestButton>
          <InterestButton
            intent="pro-monthly"
            target={`${project.slug} · ${project.name}`}
            className="inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-surface-card px-5 py-3.5 text-[14px] font-semibold text-fg-primary hover:bg-surface-card-alt"
          >
            Subscribe Pro · $200/mo
          </InterestButton>
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
            Team
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
