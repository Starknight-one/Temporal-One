import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";
import {
  BUILDERS,
  type Builder,
  getBuilder,
  getProject,
} from "@/lib/data";

export function generateStaticParams() {
  return BUILDERS.map((b) => ({ handle: b.handle }));
}

type Params = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const b = getBuilder(handle);
  if (!b) return { title: "Builder — Temporal One" };
  return { title: `${b.name} — Temporal One`, description: b.bio };
}

export default async function BuilderDetailPage({ params }: Params) {
  const { handle } = await params;
  const builder = getBuilder(handle);
  if (!builder) notFound();
  const project = getProject(builder.currentProject);

  return (
    <>
      <LandingHeader current="feed" />
      <main className="bg-surface-primary">
        <Crumbs handle={builder.handle} />
        <Hero builder={builder} />
        <Stats builder={builder} />
        <ProjectsRow builder={builder} project={project} />
        <ActivityLog builder={builder} />
      </main>
      <Footer />
    </>
  );
}

/* -------------------------- Crumbs -------------------------- */

function Crumbs({ handle }: { handle: string }) {
  return (
    <div className="px-6 pt-6 sm:px-12 md:px-20">
      <div className="mx-auto flex max-w-[1200px] items-center gap-2 font-mono text-[11px]">
        <Link href="/" className="text-fg-muted hover:text-fg-primary">
          Feed
        </Link>
        <span className="text-[#CCC]">/</span>
        <Link href="/" className="text-fg-muted hover:text-fg-primary">
          Builders
        </Link>
        <span className="text-[#CCC]">/</span>
        <span className="font-semibold text-fg-primary">{handle}</span>
      </div>
    </div>
  );
}

/* -------------------------- Hero -------------------------- */

function Hero({ builder }: { builder: Builder }) {
  return (
    <section className="px-6 pb-2 pt-5 sm:px-12 md:px-20">
      <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[1fr_380px]">
        <div className="flex items-center gap-4 py-2">
          <span
            className="flex h-20 w-20 flex-none items-center justify-center rounded-full text-[28px] font-semibold text-fg-inverse"
            style={{ backgroundColor: builder.avatarBg }}
          >
            {builder.initials}
          </span>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              {builder.verified && (
                <span className="inline-flex items-center rounded-full border border-[#D9F0BE] bg-[#F0F9E8] px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.2em] text-[#3D7B0E]">
                  VERIFIED · DAY {builder.daysIn}/{builder.totalDays}
                </span>
              )}
              <span className="font-mono text-[11px] text-fg-muted">
                @{builder.handle}
              </span>
            </div>
            <h1 className="font-display text-3xl font-semibold leading-tight tracking-[-0.01em] text-fg-primary sm:text-[34px]">
              {builder.name}
            </h1>
            <p className="text-[14px] text-fg-secondary">{builder.bio}</p>
          </div>
        </div>

        <aside className="flex flex-col gap-2.5 py-2">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-inverse px-5 py-3.5 text-[14px] font-semibold text-fg-inverse hover:opacity-90"
          >
            <LockOpenIcon />
            Unlock full builder log — $500
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-surface-card px-5 py-3.5 text-[14px] font-semibold text-fg-primary hover:bg-surface-card-alt"
          >
            Subscribe Pro · $200/mo
          </button>
          <p className="text-center font-mono text-[11px] text-fg-muted">
            Public preview shows the latest 10 entries.
          </p>
        </aside>
      </div>
    </section>
  );
}

/* -------------------------- Stats -------------------------- */

function Stats({ builder }: { builder: Builder }) {
  return (
    <SectionWrap>
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border-base bg-surface-card">
        <Cell label="ENTRIES" value={`${builder.entries} logged`} border />
        <Cell label="TIME LOGGED" value={builder.hours} />
      </div>
    </SectionWrap>
  );
}

function Cell({ label, value, border = false }: { label: string; value: string; border?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-1.5 px-6 py-5 ${
        border ? "border-r border-border-base" : ""
      }`}
    >
      <span className="font-mono text-[10px] tracking-[0.2em] text-fg-muted">
        {label}
      </span>
      <span className="font-display text-[22px] font-semibold leading-none text-fg-primary">
        {value}
      </span>
    </div>
  );
}

/* -------------------------- Projects row -------------------------- */

function ProjectsRow({
  builder,
  project,
}: {
  builder: Builder;
  project: ReturnType<typeof getProject>;
}) {
  if (!project) return null;
  return (
    <SectionWrap>
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <article className="flex flex-col gap-3.5 rounded-2xl border border-border-base bg-surface-card px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.2em] text-fg-muted">
              CURRENTLY BUILDING
            </span>
            <Link
              href={`/projects/${project.slug}`}
              className="font-mono text-[11px] font-semibold text-fg-primary hover:underline"
            >
              see project →
            </Link>
          </div>
          <div className="flex items-center gap-3.5">
            <span
              className="flex h-12 w-12 flex-none items-center justify-center rounded-[10px] border"
              style={{
                backgroundColor: project.bg + "AA",
                borderColor: project.bg,
                color: project.fg,
              }}
            >
              <SparklesIcon size={22} />
            </span>
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="font-display text-xl font-semibold leading-tight text-fg-primary">
                {project.name}
              </h3>
              <p className="text-[13px] leading-[1.5] text-fg-secondary">
                {project.longDesc}
              </p>
            </div>
            <span className="hidden rounded-full border border-border-base bg-surface-card-alt px-3 py-1.5 font-mono text-[11px] text-fg-secondary sm:inline-flex">
              role · {builder.role}
            </span>
          </div>
        </article>

        {builder.previousProjects.length > 0 && (
          <article className="flex flex-col gap-2.5 rounded-2xl border border-border-base bg-surface-card-alt px-5 py-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-fg-muted">
              PREVIOUS
            </span>
            <span className="text-[13px] font-semibold text-fg-primary">
              {builder.previousProjects[0].title}
            </span>
            <span className="font-mono text-[11px] text-fg-secondary">
              {builder.previousProjects[0].meta}
            </span>
          </article>
        )}
      </div>
    </SectionWrap>
  );
}

/* -------------------------- Activity log -------------------------- */

function ActivityLog({ builder }: { builder: Builder }) {
  const remaining = Math.max(0, builder.entries - builder.log.length);
  return (
    <SectionWrap className="pb-8">
      <div className="overflow-hidden rounded-2xl border border-border-base bg-surface-card">
        <div className="flex items-center justify-between border-b border-border-base px-6 py-4">
          <div className="flex items-center gap-3.5">
            <h2 className="font-display text-lg font-semibold text-fg-primary">
              Recent activity
            </h2>
            <span className="font-mono text-[11px] text-fg-muted">
              {builder.log.length} of {builder.entries} visible
            </span>
          </div>
          <div className="hidden gap-2 sm:flex">
            {(["All", "Code", "Doc", "Talk"] as const).map((f, i) => (
              <FilterChip key={f} active={i === 0}>
                {f}
              </FilterChip>
            ))}
          </div>
        </div>

        <ColumnHead />

        {builder.log.map((row, i) => (
          <BuilderLogRow key={i} row={row} />
        ))}

        <BlurredRow opacity={0.35} />
        <BlurredRow opacity={0.18} />

        <PaywallBox name={builder.name} remaining={remaining} />
      </div>
    </SectionWrap>
  );
}

function BuilderLogRow({
  row,
}: {
  row: { day: number; text: string; hours: string; scores: string };
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border-soft px-6 py-3">
      <span className="w-[50px] flex-none font-mono text-[12px] text-fg-muted">
        d{row.day}
      </span>
      <span className="flex-1 truncate text-[13px] text-[#333]">{row.text}</span>
      <span className="hidden w-[80px] flex-none font-mono text-[11px] text-fg-secondary md:block">
        {row.hours}
      </span>
      <span className="hidden w-[130px] flex-none text-right font-mono text-[11px] font-semibold text-[#3D7B0E] md:block">
        {row.scores}
      </span>
    </div>
  );
}

function ColumnHead() {
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
    <span className={`font-mono text-[10px] tracking-[0.2em] text-fg-muted ${className}`}>
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
        d09
      </span>
      <span className="flex-1 truncate text-[13px] text-[#E5E5E5]">
        ████████ ████████ ████████ ███████ ████ ████████ · ████
      </span>
      <span className="hidden w-[80px] flex-none font-mono text-[11px] text-[#E5E5E5] md:block">
        █h
      </span>
      <span className="hidden w-[130px] flex-none text-right font-mono text-[11px] font-semibold text-[#E5E5E5] md:block">
        █.█ / █.█
      </span>
    </div>
  );
}

function PaywallBox({ name, remaining }: { name: string; remaining: number }) {
  const first = name.split(" ")[0];
  return (
    <div className="flex flex-col items-center gap-3 border-t border-border-base bg-surface-card-alt px-6 py-8 text-center">
      <LockIcon size={28} />
      <h3 className="max-w-[640px] font-display text-2xl font-medium tracking-[-0.01em] text-fg-primary">
        {remaining} more entries from {first}&apos;s run
      </h3>
      <p className="max-w-[560px] text-[13px] text-fg-secondary">
        Each unlocked entry shows the artifact, the work session, and
        peer-verified scores.
      </p>
      <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded bg-surface-inverse px-5 py-3 text-[13px] font-semibold text-fg-inverse hover:opacity-90"
        >
          Unlock {first} · $500
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded border border-black bg-surface-card px-5 py-3 text-[13px] font-semibold text-fg-primary hover:bg-surface-card-alt"
        >
          Pro · $200/mo · all builders
        </button>
      </div>
      <p className="font-mono text-[11px] font-semibold text-accent">
        Hirers: filter by artifact precision in Pro.
      </p>
    </div>
  );
}

/* -------------------------- Shared -------------------------- */

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

function LockIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
