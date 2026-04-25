import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";
import { logEntries, type LogEntryRow } from "@/lib/db/schema";
import { ArtifactPreview, TypePill } from "@/components/admin/shared";
import { AddLogEntryButton } from "@/components/admin/AddLogEntryModal";
import { getUserTeams } from "@/lib/teams";
import type { ArtifactKind } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/app/today");

  const entries = await db
    .select()
    .from(logEntries)
    .where(eq(logEntries.userId, session.user.id))
    .orderBy(desc(logEntries.postedAt))
    .limit(50);

  const myTeams = await getUserTeams(session.user.id);

  const totalHours = entries.reduce(
    (sum, e) => sum + Number(e.timeSpent ?? 0),
    0,
  );
  const today = new Date();
  const todayKey = isoDate(today);
  const todayEntries = entries.filter(
    (e) => isoDate(e.postedAt) === todayKey,
  );
  const todayHours = todayEntries.reduce(
    (sum, e) => sum + Number(e.timeSpent ?? 0),
    0,
  );

  const previousByDate = groupPrevious(entries.filter(
    (e) => isoDate(e.postedAt) !== todayKey,
  ));

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-6">
      <StatusBar
        totalEntries={entries.length}
        totalHours={totalHours}
        todayHours={todayHours}
      />

      <AddLogEntryButton
        teams={myTeams.map((t) => ({ id: t.id, slug: t.slug, name: t.name }))}
      />

      <section className="flex flex-col gap-3.5">
        <SectionHeader
          title="TODAY"
          subtitle={fmtMonthDay(today)}
          right={`${todayEntries.length} entries · ${formatHours(todayHours)}`}
        />
        {todayEntries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-base bg-surface-card-alt px-6 py-10 text-center">
            <p className="text-[14px] text-fg-secondary">
              Nothing logged yet today.
            </p>
            <p className="mt-1 font-mono text-[11px] text-fg-muted">
              Hit “Add log entry” above. Two minutes max — title, link, type, hours.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {todayEntries.map((e) => (
              <EntryCard key={e.id} entry={e} />
            ))}
          </div>
        )}
      </section>

      {previousByDate.length > 0 && (
        <section className="overflow-hidden rounded-xl border border-border-base bg-surface-card">
          <div className="flex items-center justify-between border-b border-border-base px-5 py-3">
            <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-fg-secondary">
              PREVIOUS DAYS
            </span>
            <span className="font-mono text-[11px] text-fg-muted">
              {previousByDate.length} day{previousByDate.length === 1 ? "" : "s"} ·{" "}
              {entries.length - todayEntries.length} entries
            </span>
          </div>
          {previousByDate.map((d) => (
            <div
              key={d.date}
              className="flex items-center gap-4 border-b border-border-soft px-5 py-3 last:border-b-0 hover:bg-surface-card-alt"
            >
              <span className="w-16 font-mono text-[12px] font-semibold text-fg-primary">
                {d.label}
              </span>
              <span className="text-[13px] text-fg-secondary">
                {d.count} {d.count === 1 ? "entry" : "entries"}, {formatHours(d.hours)}
              </span>
            </div>
          ))}
        </section>
      )}

      <section className="flex flex-col gap-3 rounded-xl border border-border-base bg-surface-card-alt p-6">
        <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-fg-secondary">
          👁  WHAT EMPLOYERS SEE
        </span>
        <p className="text-[13px] leading-relaxed text-fg-secondary">
          Public summary ships when you join a cohort. For now your log is
          private to you.
        </p>
      </section>
    </div>
  );
}

function StatusBar({
  totalEntries,
  totalHours,
  todayHours,
}: {
  totalEntries: number;
  totalHours: number;
  todayHours: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border-base bg-border-base sm:grid-cols-4">
      <Cell label="ENTRIES" value={String(totalEntries)} />
      <Cell label="TOTAL TIME" value={formatHours(totalHours)} />
      <Cell label="TODAY" value={formatHours(todayHours)} />
      <Cell label="WARNINGS" value="0" tone="ok" />
    </div>
  );
}

function Cell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "ok";
}) {
  return (
    <div className="flex flex-col gap-1.5 bg-surface-card px-5 py-4">
      <span className="font-mono text-[10px] tracking-[0.2em] text-fg-muted">
        {label}
      </span>
      <span
        className={`font-display text-[18px] font-semibold leading-none ${
          tone === "ok" ? "text-[#2E7D32]" : "text-fg-primary"
        }`}
      >
        {tone === "ok" && (
          <span className="mr-1.5 inline-block h-2 w-2 translate-y-[-2px] rounded-full bg-[#2E7D32]" />
        )}
        {value}
      </span>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-fg-primary">
          {title}
        </span>
        {subtitle && (
          <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-fg-muted">
            ·  {subtitle}
          </span>
        )}
      </div>
      {right && (
        <span className="font-mono text-[11px] text-fg-muted">{right}</span>
      )}
    </div>
  );
}

function EntryCard({ entry }: { entry: LogEntryRow }) {
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
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border-base bg-surface-card px-5 py-4">
      <div className="flex items-start gap-3">
        <h4 className="flex-1 text-[15px] font-semibold leading-snug text-fg-primary">
          {entry.title}
        </h4>
      </div>
      {artifact && <ArtifactPreview artifact={artifact} />}
      <div className="flex flex-wrap items-center gap-3 border-t border-border-soft pt-3 font-mono text-[11px] text-fg-muted">
        <TypePill type={entry.type} />
        <span>{formatHours(Number(entry.timeSpent))}</span>
        <span className="ml-auto">{relativeTime(entry.postedAt)}</span>
      </div>
    </article>
  );
}

function isoDate(d: Date | string | null): string {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  return date.toISOString().slice(0, 10);
}

function fmtMonthDay(d: Date): string {
  return d.toLocaleString("en-US", { month: "short", day: "numeric" }).toUpperCase();
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

function groupPrevious(rows: LogEntryRow[]) {
  const map = new Map<string, { date: string; count: number; hours: number }>();
  for (const r of rows) {
    const key = isoDate(r.postedAt);
    const existing = map.get(key) ?? { date: key, count: 0, hours: 0 };
    existing.count += 1;
    existing.hours += Number(r.timeSpent ?? 0);
    map.set(key, existing);
  }
  return Array.from(map.values())
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((d) => ({
      ...d,
      label: new Date(d.date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
}
