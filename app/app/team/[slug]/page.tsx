import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";
import {
  logEntries,
  teamMembers,
  teams,
  users,
  type LogEntryRow,
} from "@/lib/db/schema";
import { ArtifactPreview, TypePill } from "@/components/admin/shared";
import { AddLogEntryButton } from "@/components/admin/AddLogEntryModal";
import { getUserTeams } from "@/lib/teams";
import type { ArtifactKind } from "@/lib/types";

export const dynamic = "force-dynamic";

const AVA_PALETTE = [
  { bg: "#FFF3E0", fg: "#FF9800" },
  { bg: "#EDE7F6", fg: "#5E35B1" },
  { bg: "#E0F2F1", fg: "#00897B" },
  { bg: "#E3F2FD", fg: "#1E88E5" },
  { bg: "#FCE4EC", fg: "#D81B60" },
  { bg: "#E8F5E9", fg: "#2E7D32" },
];

export default async function TeamFeedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/signin?callbackUrl=/app/team/${slug}`);

  const team = await db.query.teams.findFirst({
    where: (t, { eq }) => eq(t.slug, slug),
  });
  if (!team) notFound();

  const memberRows = await db
    .select({
      userId: teamMembers.userId,
      isLead: teamMembers.isLead,
      joinedAt: teamMembers.joinedAt,
      name: users.name,
      image: users.image,
      handle: users.handle,
    })
    .from(teamMembers)
    .leftJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.teamId, team.id));

  const me = memberRows.find((m) => m.userId === session.user.id);
  if (!me) {
    // Not a member — bounce to board.
    redirect("/app/board");
  }

  memberRows.sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime());
  const lead = memberRows.find((m) => m.isLead === 1) ?? memberRows[0];
  const dayN = computeDay(team.startedAt, team.totalDays);

  const feed = await db
    .select({
      entry: logEntries,
      authorName: users.name,
      authorHandle: users.handle,
      authorImage: users.image,
    })
    .from(logEntries)
    .leftJoin(users, eq(logEntries.userId, users.id))
    .where(eq(logEntries.teamId, team.id))
    .orderBy(desc(logEntries.postedAt))
    .limit(100);

  const myTeams = await getUserTeams(session.user.id);

  // Track unused import to keep types happy if we extend later.
  void and;

  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col gap-6">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-fg-secondary">
          <Link
            href="/app/team"
            className="text-fg-muted hover:text-fg-primary"
          >
            MY TEAMS
          </Link>{" "}
          / {team.name.toUpperCase()}
        </span>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[28px] font-semibold leading-tight text-fg-primary">
              {team.description ?? team.name}
            </h1>
            <span className="font-mono text-[12px] text-fg-secondary">
              DAY {dayN}/{team.totalDays} · {memberRows.length} /{" "}
              {team.maxMembers} members
              {me.isLead === 1 ? " · you are lead" : ""}
            </span>
          </div>
          <MemberAvatars
            members={memberRows.map((m) => ({
              userId: m.userId,
              name: m.name,
              handle: m.handle,
              image: m.image,
              isLead: m.isLead === 1,
            }))}
          />
        </div>
        {team.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {team.tags.map((t) => (
              <span
                key={t}
                className="rounded bg-[#F4F4F0] px-2 py-[3px] font-mono text-[11px] font-semibold text-fg-primary"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      <AddLogEntryButton
        teams={[{ id: team.id, slug: team.slug, name: team.name }]}
        initialTeamId={team.id}
        lockTeam
      />

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-fg-primary">
            TEAM FEED
          </span>
          <span className="font-mono text-[11px] text-fg-muted">
            {feed.length} {feed.length === 1 ? "entry" : "entries"}
          </span>
        </div>
        {feed.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-base bg-surface-card-alt px-6 py-12 text-center">
            <p className="text-[14px] text-fg-secondary">
              Nothing logged in this project yet.
            </p>
            <p className="mt-1 font-mono text-[11px] text-fg-muted">
              Be the first. Log what you shipped today.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {feed.map(({ entry, authorName, authorHandle, authorImage }) => (
              <FeedEntry
                key={entry.id}
                entry={entry}
                authorName={authorName}
                authorHandle={authorHandle}
                authorImage={authorImage}
              />
            ))}
          </div>
        )}
      </section>

      {myTeams.length > 1 && (
        <section className="flex flex-col gap-2 rounded-xl border border-border-base bg-surface-card-alt p-5">
          <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-fg-secondary">
            ALSO IN
          </span>
          <div className="flex flex-wrap gap-2">
            {myTeams
              .filter((t) => t.slug !== slug)
              .map((t) => (
                <Link
                  key={t.id}
                  href={`/app/team/${t.slug}`}
                  className="rounded-md border border-border-base bg-surface-card px-3 py-1.5 text-[12px] font-medium text-fg-primary hover:bg-surface-card-alt"
                >
                  {t.name}
                </Link>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MemberAvatars({
  members,
}: {
  members: Array<{
    userId: string;
    name: string | null;
    handle: string | null;
    image: string | null;
    isLead: boolean;
  }>;
}) {
  return (
    <div className="flex -space-x-2">
      {members.map((m) => {
        const ava = pickFromPalette(m.userId, AVA_PALETTE);
        return (
          <span
            key={m.userId}
            title={`${m.name ?? m.handle ?? ""}${m.isLead ? " · lead" : ""}`}
            className={`inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full font-mono text-[10px] font-bold ring-2 ring-surface-card ${
              m.isLead ? "outline outline-1 outline-accent" : ""
            }`}
            style={
              m.image
                ? undefined
                : { background: ava.bg, color: ava.fg }
            }
          >
            {m.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.image}
                alt=""
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              avaInitials(m.name, m.handle)
            )}
          </span>
        );
      })}
    </div>
  );
}

function FeedEntry({
  entry,
  authorName,
  authorHandle,
  authorImage,
}: {
  entry: LogEntryRow;
  authorName: string | null;
  authorHandle: string | null;
  authorImage: string | null;
}) {
  const meta = entry.artifactMeta as
    | { shortUrl?: string; number?: string }
    | null;
  const artifact = entry.artifactUrl
    ? {
        kind: (entry.artifactKind ?? "external") as ArtifactKind,
        title:
          entry.artifactKind === "github" && meta?.number
            ? `GitHub PR #${meta.number}`
            : entry.artifactUrl,
        meta: meta?.shortUrl ?? entry.artifactUrl,
        href: entry.artifactUrl,
      }
    : null;
  const ava = pickFromPalette(entry.userId, AVA_PALETTE);

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border-base bg-surface-card px-5 py-4">
      <div className="flex items-center gap-2.5">
        <span
          className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full font-mono text-[10px] font-bold"
          style={
            authorImage
              ? undefined
              : { background: ava.bg, color: ava.fg }
          }
        >
          {authorImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={authorImage}
              alt=""
              width={28}
              height={28}
              className="h-full w-full object-cover"
            />
          ) : (
            avaInitials(authorName, authorHandle)
          )}
        </span>
        <span className="text-[13px] font-medium text-fg-primary">
          {authorName ?? authorHandle ?? "Member"}
        </span>
        <span className="ml-auto font-mono text-[11px] text-fg-muted">
          {relativeTime(entry.postedAt)}
        </span>
      </div>
      <h4 className="text-[15px] font-semibold leading-snug text-fg-primary">
        {entry.title}
      </h4>
      {artifact && <ArtifactPreview artifact={artifact} />}
      {entry.note && (
        <p className="whitespace-pre-wrap text-[13px] leading-[1.5] text-fg-secondary">
          {entry.note}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3 border-t border-border-soft pt-3 font-mono text-[11px] text-fg-muted">
        <TypePill type={entry.type} />
        <span>{formatHours(Number(entry.timeSpent))}</span>
      </div>
    </article>
  );
}

function computeDay(startedAt: Date | null, totalDays: number): number {
  if (!startedAt) return 1;
  const elapsedMs = Date.now() - new Date(startedAt).getTime();
  const day = Math.floor(elapsedMs / (24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, Math.min(totalDays, day));
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

function formatHours(h: number): string {
  if (!Number.isFinite(h) || h === 0) return "0h";
  return `${h.toFixed(h % 1 === 0 ? 0 : 1)}h`;
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
