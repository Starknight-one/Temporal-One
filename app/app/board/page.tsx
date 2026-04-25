import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";
import { teams, teamMembers, users } from "@/lib/db/schema";
import {
  ProjectCard,
  type ProjectCardMember,
  type ProjectCardTeam,
} from "@/components/admin/ProjectCard";
import { CreateProjectButton } from "@/components/admin/CreateProjectModal";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/app/board");
  const userId = session.user.id;

  const allTeams = await db
    .select()
    .from(teams)
    .orderBy(desc(teams.createdAt));

  const memberRows = await db
    .select({
      teamId: teamMembers.teamId,
      userId: teamMembers.userId,
      isLead: teamMembers.isLead,
      joinedAt: teamMembers.joinedAt,
      name: users.name,
      image: users.image,
      handle: users.handle,
    })
    .from(teamMembers)
    .leftJoin(users, eq(teamMembers.userId, users.id));

  const byTeam = new Map<
    string,
    Array<ProjectCardMember & { joinedAt: Date }>
  >();
  for (const m of memberRows) {
    const arr = byTeam.get(m.teamId) ?? [];
    arr.push({
      userId: m.userId,
      name: m.name,
      image: m.image,
      handle: m.handle,
      isLead: m.isLead === 1,
      joinedAt: m.joinedAt,
    });
    byTeam.set(m.teamId, arr);
  }

  const cards = allTeams.map((t) => {
    const members = (byTeam.get(t.id) ?? []).sort(
      (a, b) => a.joinedAt.getTime() - b.joinedAt.getTime(),
    );
    return {
      team: t as ProjectCardTeam,
      members: members as ProjectCardMember[],
    };
  });

  const total = cards.length;
  const hiringCount = cards.filter(
    (c) =>
      c.team.status === "open" && c.members.length < c.team.maxMembers,
  ).length;
  const categoryCounts = new Map<string, number>();
  for (const c of cards) {
    const cat = c.team.category;
    if (!cat) continue;
    categoryCounts.set(cat, (categoryCounts.get(cat) ?? 0) + 1);
  }

  const myTeamCount = cards.filter((c) =>
    c.members.some((m) => m.userId === userId),
  ).length;

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6">
      <header className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-fg-secondary">
            <span className="text-fg-muted">TEMPORAL ONE / </span>BOARD
          </span>
          <h1 className="text-[34px] font-semibold leading-tight text-fg-primary">
            What&apos;s being built right now
          </h1>
          <p className="max-w-[640px] text-[15px] leading-[1.5] text-fg-secondary">
            Open sprints from teams across Temporal One. Join one — or start
            your own. No applications, no LinkedIn. One click, then ship for 30
            days.
          </p>
        </div>
        <CreateProjectButton />
      </header>

      <Toolbar
        total={total}
        hiringCount={hiringCount}
        categoryCounts={categoryCounts}
      />

      {cards.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {cards.map(({ team, members }) => (
              <ProjectCard
                key={team.id}
                team={team}
                members={members}
                currentUserId={userId}
              />
            ))}
          </div>
          <Sidebar showCreate={myTeamCount === 0} />
        </div>
      )}
    </div>
  );
}

function Toolbar({
  total,
  hiringCount,
  categoryCounts,
}: {
  total: number;
  hiringCount: number;
  categoryCounts: Map<string, number>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex w-[340px] items-center gap-2.5 rounded-lg border border-border-base bg-surface-card px-3.5 py-2.5">
        <SearchIcon />
        <span className="text-[13px] text-fg-muted">
          Search by skill, stack, or vibe
        </span>
      </div>
      <Pill label="All" count={total} active />
      <Pill label="Hiring" count={hiringCount} />
      {Array.from(categoryCounts.entries()).map(([cat, count]) => (
        <Pill key={cat} label={cat} count={count} />
      ))}
      <span className="ml-auto inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-fg-secondary">
        Sort: Most active
        <ChevronDown />
      </span>
    </div>
  );
}

function Pill({
  label,
  count,
  active,
}: {
  label: string;
  count: number;
  active?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] ${
        active
          ? "bg-fg-primary font-semibold text-fg-inverse"
          : "border border-border-base bg-surface-card text-fg-primary"
      }`}
    >
      {label}
      <span
        className={`font-mono text-[11px] font-semibold ${
          active ? "text-[#A1A1A1]" : "text-fg-muted"
        }`}
      >
        {count}
      </span>
    </span>
  );
}

function Sidebar({ showCreate }: { showCreate: boolean }) {
  return (
    <aside className="flex flex-col gap-5">
      <div className="flex flex-col gap-3.5 rounded-[10px] border border-border-base bg-surface-card px-[22px] py-5">
        <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-fg-muted">
          HOW JOINING WORKS
        </span>
        <Step n="01" t="Tap Join on any open project. No application, no CV." />
        <Step n="02" t="The team picks up your day-1 log when you start posting." />
        <Step n="03" t="In a team and want out? Tap Leave. You can join another." />
      </div>
      {showCreate && (
        <div className="flex flex-col gap-3 rounded-[10px] bg-fg-primary px-[22px] py-5 text-fg-inverse">
          <span className="font-mono text-[11px] font-bold tracking-[0.1em] text-accent">
            NO TEAM YET?
          </span>
          <p className="text-[14px] leading-[1.5] text-[#E0E0E0]">
            Spin up your own sprint. You become the lead, set the team size,
            others join from this board.
          </p>
          <CreateProjectButton variant="accent" />
        </div>
      )}
    </aside>
  );
}

function Step({ n, t }: { n: string; t: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="font-mono text-[13px] font-bold text-accent">{n}</span>
      <span className="text-[13px] leading-[1.5] text-fg-primary">{t}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-base bg-surface-card-alt px-6 py-16 text-center">
      <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-fg-secondary">
        NO PROJECTS YET
      </span>
      <p className="max-w-[360px] text-[14px] text-fg-secondary">
        Be the first. Spin up a sprint, set what you&apos;re building, and the
        next person who lands on this page can join you.
      </p>
      <CreateProjectButton />
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-fg-muted"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
