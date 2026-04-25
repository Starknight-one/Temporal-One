import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { logEntries, teamMembers, teams, users } from "@/lib/db/schema";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

const DOT_PALETTE = [
  "#FF9800",
  "#7E57C2",
  "#26A69A",
  "#42A5F5",
  "#EC407A",
  "#66BB6A",
];

const AVA_PALETTE = [
  { bg: "#FFF3E0", fg: "#FF9800" },
  { bg: "#EDE7F6", fg: "#5E35B1" },
  { bg: "#E0F2F1", fg: "#00897B" },
  { bg: "#E3F2FD", fg: "#1E88E5" },
  { bg: "#FCE4EC", fg: "#D81B60" },
  { bg: "#E8F5E9", fg: "#2E7D32" },
];

const TYPE_LABELS: Record<string, string> = {
  built: "Built",
  fixed: "Fixed",
  researched: "Researched",
  designed: "Designed",
  shipped: "Shipped",
  blocked: "Blocked",
};

export default async function HomePage() {
  const allTeams = await db
    .select()
    .from(teams)
    .orderBy(desc(teams.createdAt))
    .limit(6);

  const memberRows = await db
    .select({
      teamId: teamMembers.teamId,
      userId: teamMembers.userId,
      isLead: teamMembers.isLead,
      joinedAt: teamMembers.joinedAt,
      name: users.name,
      handle: users.handle,
      image: users.image,
    })
    .from(teamMembers)
    .leftJoin(users, eq(teamMembers.userId, users.id));

  const byTeam = new Map<string, typeof memberRows>();
  for (const m of memberRows) {
    const arr = byTeam.get(m.teamId) ?? [];
    arr.push(m);
    byTeam.set(m.teamId, arr);
  }

  const teamCards = allTeams.map((t) => {
    const members = (byTeam.get(t.id) ?? []).slice().sort(
      (a, b) => a.joinedAt.getTime() - b.joinedAt.getTime(),
    );
    const lead = members.find((m) => m.isLead === 1) ?? members[0] ?? null;
    return { team: t, members, lead };
  });

  const recentLogs = await db
    .select({
      entry: logEntries,
      authorName: users.name,
      authorHandle: users.handle,
      authorImage: users.image,
      teamSlug: teams.slug,
      teamName: teams.name,
    })
    .from(logEntries)
    .leftJoin(users, eq(logEntries.userId, users.id))
    .leftJoin(teams, eq(logEntries.teamId, teams.id))
    .orderBy(desc(logEntries.postedAt))
    .limit(12);

  const totalProjects = teamCards.length;
  const totalBuilders = new Set(memberRows.map((m) => m.userId)).size;

  const hasActivity = totalProjects > 0 || recentLogs.length > 0;

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

        {hasActivity ? (
          <section className="px-6 pb-20 sm:px-12 md:px-20">
            <div className="mx-auto flex max-w-[1080px] flex-col gap-12">
              <ActivityStrip
                projects={totalProjects}
                builders={totalBuilders}
                logs={recentLogs.length}
              />
              {teamCards.length > 0 && <ProjectsGrid cards={teamCards} />}
              {recentLogs.length > 0 && <LogStream rows={recentLogs} />}
            </div>
          </section>
        ) : (
          <EmptyCohort />
        )}
      </main>
      <Footer />
    </>
  );
}

function ActivityStrip({
  projects,
  builders,
  logs,
}: {
  projects: number;
  builders: number;
  logs: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border-base bg-border-base">
      <Stat label="ACTIVE PROJECTS" value={String(projects)} />
      <Stat label="BUILDERS" value={String(builders)} />
      <Stat label="LOGS THIS WEEK" value={String(logs)} live />
    </div>
  );
}

function Stat({
  label,
  value,
  live,
}: {
  label: string;
  value: string;
  live?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 bg-surface-card px-6 py-5 sm:px-8 sm:py-6">
      <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-fg-muted">
        {label}
      </span>
      <span className="flex items-center gap-2 font-display text-[26px] font-semibold text-fg-primary">
        {live && (
          <span className="relative inline-block h-2 w-2 rounded-full bg-accent">
            <span className="live-ping" />
          </span>
        )}
        {value}
      </span>
    </div>
  );
}

function ProjectsGrid({
  cards,
}: {
  cards: Array<{
    team: typeof teams.$inferSelect;
    members: Array<{ name: string | null; handle: string | null; image: string | null; userId: string; isLead: number }>;
    lead: { name: string | null; handle: string | null; userId: string } | null;
  }>;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[28px] font-semibold leading-tight text-fg-primary">
          What&apos;s being built right now
        </h2>
        <Link
          href="/signin?callbackUrl=/app/board"
          className="font-mono text-[12px] font-semibold text-fg-primary hover:text-accent"
        >
          See the board →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ team, members, lead }) => (
          <PublicProjectCard
            key={team.id}
            team={team}
            members={members}
            lead={lead}
          />
        ))}
      </div>
    </section>
  );
}

function PublicProjectCard({
  team,
  members,
  lead,
}: {
  team: typeof teams.$inferSelect;
  members: Array<{ userId: string; isLead: number }>;
  lead: { name: string | null; handle: string | null; userId: string } | null;
}) {
  const dotColor = pickFromPalette(team.id, DOT_PALETTE);
  const ava = pickFromPalette(lead?.userId ?? team.id, AVA_PALETTE);
  const dayN = computeDay(team.startedAt, team.totalDays);
  const memberCount = members.length;
  const isFull = memberCount >= team.maxMembers;
  const showHiring = team.status === "open" && !isFull && team.maxMembers > 1;

  return (
    <article className="flex flex-col gap-3.5 rounded-[10px] border border-border-base bg-surface-card px-[22px] py-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: dotColor }}
            />
            <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-fg-secondary">
              {team.name.toUpperCase()} · DAY {dayN}/{team.totalDays}
            </span>
          </div>
          <h3 className="text-[17px] font-semibold leading-[1.3] text-fg-primary">
            {team.description ?? team.name}
          </h3>
        </div>
        {showHiring && (
          <span className="rounded-md bg-[#E8F7EE] px-2 py-[3px] font-mono text-[10px] font-bold tracking-[0.1em] text-[#1F8A48]">
            HIRING
          </span>
        )}
      </header>

      {team.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {team.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded bg-[#F4F4F0] px-2 py-[3px] font-mono text-[11px] font-semibold text-fg-primary"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <footer className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-[9px] font-bold"
            style={{ background: ava.bg, color: ava.fg }}
          >
            {avaInitials(lead?.name, lead?.handle)}
          </span>
          <span className="text-[12px] font-medium text-fg-secondary">
            {memberCount} / {team.maxMembers}{" "}
            {team.maxMembers === 1 ? "solo" : "members"}
          </span>
        </div>
        <Link
          href="/signin?callbackUrl=/app/board"
          className="font-mono text-[11px] font-semibold text-fg-primary hover:text-accent"
        >
          Sign in to join →
        </Link>
      </footer>
    </article>
  );
}

function LogStream({
  rows,
}: {
  rows: Array<{
    entry: typeof logEntries.$inferSelect;
    authorName: string | null;
    authorHandle: string | null;
    authorImage: string | null;
    teamSlug: string | null;
    teamName: string | null;
  }>;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[28px] font-semibold leading-tight text-fg-primary">
          Latest from the field
        </h2>
        <Link
          href="/for-hirers"
          className="font-mono text-[12px] font-semibold text-fg-primary hover:text-accent"
        >
          Unlock full logs →
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border-base bg-surface-card">
        {rows.map(
          (
            { entry, authorName, authorHandle, teamName, teamSlug },
            idx,
          ) => {
            const ava = pickFromPalette(entry.userId, AVA_PALETTE);
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-4 px-5 py-4 ${
                  idx > 0 ? "border-t border-border-soft" : ""
                }`}
              >
                <span
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold"
                  style={{ background: ava.bg, color: ava.fg }}
                >
                  {avaInitials(authorName, authorHandle)}
                </span>
                <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-semibold text-fg-primary">
                      {authorName ?? authorHandle ?? "builder"}
                    </span>
                    {teamSlug && teamName && (
                      <span className="font-mono text-[11px] text-fg-muted">
                        · {teamName}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[14px] text-fg-primary">
                    {entry.title}
                  </p>
                </div>
                <div className="hidden shrink-0 items-center gap-3 font-mono text-[11px] text-fg-muted sm:flex">
                  <span className="rounded-md bg-surface-card-alt px-2 py-[3px] font-semibold text-fg-secondary">
                    {TYPE_LABELS[entry.type] ?? entry.type}
                  </span>
                  <span>{relativeTime(entry.postedAt)}</span>
                </div>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}

function EmptyCohort() {
  return (
    <section className="px-6 pb-20 sm:px-12 md:px-20">
      <div className="mx-auto max-w-[840px] rounded-2xl border border-dashed border-border-base bg-surface-card-alt px-8 py-12 text-center sm:px-14 sm:py-16">
        <span className="font-mono text-[10px] font-semibold tracking-[0.25em] text-accent">
          NO PROJECTS YET
        </span>
        <h2 className="mt-4 font-display text-[28px] font-semibold leading-tight text-fg-primary sm:text-[34px]">
          Be the first to start a sprint.
        </h2>
        <p className="mx-auto mt-3 max-w-[540px] text-[14px] leading-relaxed text-fg-secondary">
          Sign in with Google or Telegram, spin up a project, and the next
          person who lands on this page can join you.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 rounded-full bg-surface-inverse px-5 py-3 text-[13px] font-semibold text-fg-inverse hover:opacity-90"
          >
            Start a project →
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
  );
}

function avaInitials(
  name: string | null | undefined,
  handle: string | null | undefined,
): string {
  const src = (name?.trim() || handle?.trim() || "??").trim();
  const parts = src.split(/[\s.\-_]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function pickFromPalette<T>(seed: string, palette: T[]): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % palette.length;
  return palette[idx];
}

function computeDay(startedAt: Date | null, totalDays: number): number {
  if (!startedAt) return 1;
  const elapsedMs = Date.now() - new Date(startedAt).getTime();
  const day = Math.floor(elapsedMs / (24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, Math.min(totalDays, day));
}

function relativeTime(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  const ms = Date.now() - date.getTime();
  const min = Math.round(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.round(h / 24);
  return `${days}d ago`;
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
