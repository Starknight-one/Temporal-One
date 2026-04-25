import {
  JoinButton,
  LeaveButton,
  DeleteProjectButton,
} from "./ProjectActions";

const DOT_PALETTE = [
  "#FF9800",
  "#7E57C2",
  "#26A69A",
  "#42A5F5",
  "#EC407A",
  "#66BB6A",
  "#FFA726",
  "#5C6BC0",
];

const AVA_PALETTE = [
  { bg: "#FFF3E0", fg: "#FF9800" },
  { bg: "#EDE7F6", fg: "#5E35B1" },
  { bg: "#E0F2F1", fg: "#00897B" },
  { bg: "#E3F2FD", fg: "#1E88E5" },
  { bg: "#FCE4EC", fg: "#D81B60" },
  { bg: "#E8F5E9", fg: "#2E7D32" },
];

export type ProjectCardMember = {
  userId: string;
  name: string | null;
  image: string | null;
  handle: string | null;
  isLead: boolean;
};

export type ProjectCardTeam = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string | null;
  tags: string[];
  status: "open" | "running" | "shipped" | "abandoned";
  maxMembers: number;
  totalDays: number;
  startedAt: Date | null;
};

export function ProjectCard({
  team,
  members,
  currentUserId,
}: {
  team: ProjectCardTeam;
  members: ProjectCardMember[];
  currentUserId: string;
}) {
  const lead =
    members.find((m) => m.isLead) ?? members[0] ?? null;
  const myMembership = members.find((m) => m.userId === currentUserId);
  const isMember = !!myMembership;
  const isLead = !!myMembership?.isLead;
  const memberCount = members.length;
  const isFull = memberCount >= team.maxMembers;
  const showHiring = team.status === "open" && !isFull;

  const dotColor = pickFromPalette(team.id, DOT_PALETTE);
  const ava = pickFromPalette(lead?.userId ?? team.id, AVA_PALETTE);
  const dayN = computeDay(team.startedAt, team.totalDays);

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
          <h3 className="text-[18px] font-semibold leading-[1.3] text-fg-primary">
            {team.description ?? "—"}
          </h3>
        </div>
        {showHiring && (
          <span className="rounded-md bg-[#E8F7EE] px-2 py-[3px] font-mono text-[10px] font-bold tracking-[0.1em] text-[#1F8A48]">
            HIRING
          </span>
        )}
        {team.status === "shipped" && (
          <span className="rounded-md bg-[#E3F2FD] px-2 py-[3px] font-mono text-[10px] font-bold tracking-[0.1em] text-[#1976D2]">
            SHIPPED
          </span>
        )}
      </header>

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

      <footer className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-[9px] font-bold"
            style={{ background: ava.bg, color: ava.fg }}
          >
            {avaInitials(lead?.name, lead?.handle)}
          </span>
          <span className="text-[13px] font-medium text-fg-secondary">
            {lead?.name ?? lead?.handle ?? "—"} · {memberCount} / {team.maxMembers}{" "}
            members
          </span>
        </div>
        {isLead ? (
          <DeleteProjectButton slug={team.slug} />
        ) : isMember ? (
          <LeaveButton slug={team.slug} />
        ) : isFull || team.status !== "open" ? (
          <span className="font-mono text-[11px] text-fg-muted">
            {isFull ? "Team full" : "Closed"}
          </span>
        ) : (
          <JoinButton slug={team.slug} />
        )}
      </footer>
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
