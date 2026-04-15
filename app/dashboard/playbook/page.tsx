import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const metadata: Metadata = {
  title: "Playbook — Temporal One",
};

type Assignee = { initials: string; color: string };
type TaskState = "done" | "current" | "overdue" | "todo";
type Task = {
  title: string;
  state: TaskState;
  due?: string;
  dueNote?: string;
  assignees: Assignee[];
};

const SK: Assignee = { initials: "SK", color: "#2D5A27" };
const MR: Assignee = { initials: "MR", color: "#4A2D6F" };
const LP: Assignee = { initials: "LP", color: "#6F4A2D" };
const DJ: Assignee = { initials: "DJ", color: "#2D4A6F" };

const WEEK1: Task[] = [
  {
    title: "Define your target user and core problem statement",
    state: "done",
    assignees: [DJ],
  },
  {
    title: "Conduct 5+ user interviews with target audience",
    state: "done",
    assignees: [SK],
  },
  { title: "Create competitive analysis document", state: "done", assignees: [DJ] },
  {
    title: "Define MVP scope and prioritize features",
    state: "done",
    assignees: [DJ, SK],
  },
];

const WEEK2: Task[] = [
  {
    title: "Set up repository, CI/CD, and dev environment",
    state: "done",
    assignees: [MR],
  },
  { title: "Design system and component library", state: "done", assignees: [LP] },
  { title: "Database schema and data model", state: "done", assignees: [MR] },
  {
    title: "Build candidate scoring algorithm",
    state: "current",
    due: "Due Mar 20",
    dueNote: "In progress",
    assignees: [SK],
  },
  {
    title: "REST API — all endpoints live",
    state: "current",
    due: "Due Mar 18",
    dueNote: "In progress",
    assignees: [MR],
  },
  {
    title: "User flow wireframes for job detail page",
    state: "overdue",
    due: "Due Mar 14",
    dueNote: "Overdue",
    assignees: [LP],
  },
  {
    title: "Integrate auth flow with frontend",
    state: "overdue",
    due: "Due Mar 15",
    dueNote: "Overdue",
    assignees: [MR],
  },
  { title: "Landing page and signup flow", state: "todo", assignees: [SK] },
  { title: "Employer dashboard MVP", state: "todo", assignees: [DJ] },
  {
    title: "Matching algorithm v2 — culture fit scoring",
    state: "todo",
    assignees: [SK],
  },
];

const WEEK3: Task[] = [
  { title: "Deploy to production", state: "todo", assignees: [] },
  { title: "Onboard 50 beta users", state: "todo", assignees: [] },
  { title: "Collect user feedback and iterate", state: "todo", assignees: [] },
  { title: "Prepare demo day presentation", state: "todo", assignees: [] },
  { title: "Compile traction metrics and growth data", state: "todo", assignees: [] },
  {
    title: "Demo Day — present to investors and mentors",
    state: "todo",
    assignees: [],
  },
];

export default function PlaybookPage() {
  return (
    <>
      <DashboardSidebar active="playbook" />
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border-base px-8 py-5">
          <div className="flex items-center gap-3">
            <span className="text-xl">✓</span>
            <h1 className="text-[22px] font-bold text-fg-primary">Playbook</h1>
          </div>
          <button className="rounded border border-border-base px-4 py-2 text-[13px] text-fg-secondary transition-colors hover:border-fg-secondary hover:text-fg-primary">
            Filter
          </button>
        </div>

        {/* Scroll area */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-6">
          {/* Curator card */}
          <div className="flex items-start gap-5 border border-accent bg-surface-card p-6">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-fg-primary"
              style={{ backgroundColor: "#8B5CF6" }}
            >
              AV
            </span>
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-lg font-bold text-fg-primary">
                Alex Vasquez
              </span>
              <span className="text-sm text-fg-secondary">
                Curator · Serial Entrepreneur · 3x Founder (1 exit)
              </span>
              <p className="pt-1 text-[13px] leading-[1.5] text-fg-secondary">
                Your playbook is a curated list of tasks and milestones
                designed to keep your team on track. Complete them in order for
                the best results.
              </p>
            </div>
            <span className="border border-accent px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-accent">
              Curator
            </span>
          </div>

          {/* Overview metrics */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <MetricCard value="7/18" label="Tasks Done" valueAccent />
            <MetricCard value="39%" label="Progress" valueAccent />
            <MetricCard value="3" label="Overdue" labelTone="#EF4444" />
            <MetricCard value="21d" label="Until Demo" />
          </div>

          {/* Week 1 */}
          <Section title="Week 1: Validation" badge={{ label: "Complete", tone: "done" }}>
            {WEEK1.map((t, i) => (
              <Row key={i} task={t} />
            ))}
          </Section>

          {/* Week 2 */}
          <Section
            title="Weeks 2–4: Build"
            badge={{ label: "In progress", tone: "progress" }}
            titleTone="white"
          >
            {WEEK2.map((t, i) => (
              <Row key={i} task={t} />
            ))}
          </Section>

          {/* Week 3 */}
          <Section
            title="Weeks 5–6: Launch & Demo"
            badge={{ label: "Upcoming", tone: "upcoming" }}
            titleTone="muted"
          >
            {WEEK3.map((t, i) => (
              <Row key={i} task={t} />
            ))}
          </Section>
        </div>
      </main>
    </>
  );
}

function MetricCard({
  value,
  label,
  valueAccent,
  labelTone,
}: {
  value: string;
  label: string;
  valueAccent?: boolean;
  labelTone?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 border border-border-base bg-surface-card p-5">
      <span
        className={`font-display text-[28px] leading-none ${
          valueAccent ? "text-accent" : "text-fg-primary"
        }`}
      >
        {value}
      </span>
      <span
        className="font-mono text-[10px] uppercase tracking-[0.1em]"
        style={{ color: labelTone ?? "#A1A1AA" }}
      >
        {label}
      </span>
    </div>
  );
}

function Section({
  title,
  badge,
  titleTone = "accent",
  children,
}: {
  title: string;
  badge: { label: string; tone: "done" | "progress" | "upcoming" };
  titleTone?: "accent" | "white" | "muted";
  children: React.ReactNode;
}) {
  const titleColor =
    titleTone === "accent"
      ? "text-accent"
      : titleTone === "white"
      ? "text-fg-primary"
      : "text-fg-secondary";

  const badgeStyles = {
    done: { bg: "#1A2E0A", color: "#39FF14" },
    progress: { bg: "#2E1A0A", color: "#F59E0B" },
    upcoming: { bg: "transparent", color: "#A1A1AA", border: true },
  }[badge.tone];

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2.5 py-3">
        <span
          className={`font-mono text-[11px] uppercase tracking-[0.2em] ${titleColor}`}
        >
          {title}
        </span>
        <span
          className="px-2.5 font-mono text-[9px] uppercase tracking-[0.25em]"
          style={{
            backgroundColor: badgeStyles.bg,
            color: badgeStyles.color,
            padding: "3px 10px",
            border: "border" in badgeStyles ? "1px solid #2A2A2A" : undefined,
          }}
        >
          {badge.label}
        </span>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function Row({ task }: { task: Task }) {
  const bg =
    task.state === "current"
      ? "#0A140A"
      : task.state === "overdue"
      ? "#1A0A0A"
      : undefined;

  const leftBorderColor =
    task.state === "current"
      ? "#39FF14"
      : task.state === "overdue"
      ? "#EF4444"
      : undefined;

  return (
    <div
      className="flex items-center gap-3 border-t border-border-base px-4 py-3.5"
      style={{
        backgroundColor: bg,
        borderLeft: leftBorderColor ? `1px solid ${leftBorderColor}` : undefined,
        borderTop: leftBorderColor
          ? `1px solid ${leftBorderColor}`
          : undefined,
      }}
    >
      <Checkbox state={task.state} />

      <div className="flex flex-1 flex-col gap-0.5">
        <span
          className={`text-sm ${
            task.state === "current" || task.state === "overdue"
              ? "font-medium text-fg-primary"
              : task.state === "done"
              ? "text-fg-secondary"
              : "text-fg-primary"
          }`}
        >
          {task.title}
        </span>
        {task.due && (
          <span
            className="font-mono text-[10px] uppercase tracking-[0.1em]"
            style={{
              color: task.state === "overdue" ? "#EF4444" : "#39FF14",
            }}
          >
            {task.due} · {task.dueNote}
          </span>
        )}
      </div>

      {task.assignees.length > 0 && (
        <div className="flex items-center" style={{ marginRight: 0 }}>
          {task.assignees.map((a, i) => (
            <span
              key={i}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-semibold text-fg-primary"
              style={{
                backgroundColor: a.color,
                marginLeft: i === 0 ? 0 : -6,
                border:
                  task.assignees.length > 1
                    ? "1.5px solid #141414"
                    : undefined,
              }}
            >
              {a.initials}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Checkbox({ state }: { state: TaskState }) {
  if (state === "done") {
    return (
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded bg-accent text-[11px] font-bold text-fg-inverse">
        ✓
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="h-[18px] w-[18px] rounded border-2 border-accent" />
    );
  }
  if (state === "overdue") {
    return (
      <span className="h-[18px] w-[18px] rounded border-2 border-[#EF4444]" />
    );
  }
  return <span className="h-[18px] w-[18px] rounded border border-border-base" />;
}
