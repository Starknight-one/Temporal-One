import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const metadata: Metadata = {
  title: "Board — Temporal One",
};

type Priority = "low" | "med" | "high";
type Assignee = { initials: string; color: string };

type Task = {
  title: string;
  priority: Priority;
  assignee?: Assignee;
  current?: boolean;
  done?: boolean;
};

const SK: Assignee = { initials: "SK", color: "#E879F9" };
const MR: Assignee = { initials: "MR", color: "#38BDF8" };
const LP: Assignee = { initials: "LP", color: "#FB923C" };

const COLUMNS: { label: string; tasks: Task[] }[] = [
  {
    label: "Backlog",
    tasks: [
      { title: "Set up CI/CD pipeline", priority: "med" },
      { title: "Write API documentation", priority: "low" },
      { title: "Design email templates", priority: "high" },
    ],
  },
  {
    label: "In Progress",
    tasks: [
      {
        title: "Candidate scoring algorithm",
        priority: "high",
        assignee: SK,
        current: true,
      },
      { title: "Job detail page UI", priority: "med", assignee: LP },
      { title: "Auth flow integration", priority: "med", assignee: MR },
    ],
  },
  {
    label: "In Review",
    tasks: [
      { title: "Skills taxonomy API", priority: "med", assignee: MR },
      { title: "Dashboard wireframes", priority: "low", assignee: LP },
    ],
  },
  {
    label: "Done",
    tasks: [
      { title: "Database schema", priority: "low", done: true },
      { title: "User auth system", priority: "low", done: true },
      { title: "Landing page design", priority: "low", done: true },
    ],
  },
];

const PRIORITY_COLOR: Record<Priority, string> = {
  low: "#34D399",
  med: "#FACC15",
  high: "#EF4444",
};

export default function BoardPage() {
  return (
    <>
      <DashboardSidebar active="board" />
      <main className="flex flex-1 flex-col overflow-hidden px-7 py-6">
        {/* Top bar */}
        <div className="flex items-center gap-2.5 pb-4">
          <h1 className="text-2xl font-bold text-fg-primary">Board</h1>
          <div className="flex-1" />
          <button
            type="button"
            className="rounded-md border border-border-base px-3.5 py-2 text-[13px] text-fg-secondary transition-colors hover:border-fg-secondary hover:text-fg-primary"
          >
            Filter
          </button>
          <button
            type="button"
            className="rounded-md bg-accent px-3.5 py-2 text-[13px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover"
          >
            + Add task
          </button>
        </div>

        {/* Columns */}
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-auto md:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.label} className="flex min-h-0 flex-col">
              <div className="flex items-center gap-2 pb-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-secondary">
                  {col.label}
                </span>
                <span className="font-mono text-[11px] text-[#52525B]">
                  {col.tasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {col.tasks.map((t, i) => (
                  <TaskCard key={i} task={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div
      className={`flex flex-col gap-2.5 rounded-lg bg-surface-card p-3.5 ${
        task.current
          ? "border border-accent"
          : "border border-border-base"
      } ${task.done ? "opacity-60" : ""}`}
    >
      <p className="text-sm text-fg-primary">{task.title}</p>
      <div className="flex items-center justify-between">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: PRIORITY_COLOR[task.priority] }}
        />
        {task.assignee && (
          <div className="flex items-center gap-1">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-fg-inverse"
              style={{ backgroundColor: task.assignee.color }}
            >
              {task.assignee.initials}
            </span>
            <span className="text-[10px] text-fg-secondary">
              {task.assignee.initials}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
