import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const metadata: Metadata = {
  title: "Activity — Temporal One",
};

type ActivityItem = {
  time: string;
  initials: string;
  color: string;
  title: string;
  detail: string;
};

const ACTIVITY: ActivityItem[] = [
  {
    time: "2h ago",
    initials: "SK",
    color: "#E879F9",
    title: "Sarah K. pushed 12 commits",
    detail:
      "Implemented candidate scoring algorithm and added skills taxonomy API endpoint.",
  },
  {
    time: "8h ago",
    initials: "LP",
    color: "#FB923C",
    title: "Lisa P. shared 8 new screens",
    detail: "Candidate dashboard, job detail cards, and matching results flow.",
  },
  {
    time: "1d ago",
    initials: "MR",
    color: "#38BDF8",
    title: "Marcus R. deployed REST API to production",
    detail: "14 endpoints live. Skills matching returning results in <200ms.",
  },
  {
    time: "2d ago",
    initials: "DJ",
    color: "#34D399",
    title: "David J. published roadmap for Weeks 4–5",
    detail:
      "Focus: employer dashboard, bulk matching, onboarding flow. Demo day target: 50 active users.",
  },
];

export default function ActivityPage() {
  return (
    <>
      <DashboardSidebar active="activity" />
      <main className="flex flex-1 flex-col gap-5 overflow-hidden px-8 py-6">
        <h1 className="text-2xl font-bold text-fg-primary">Activity</h1>
        <ol className="flex flex-col overflow-y-auto">
          {ACTIVITY.map((a, i) => (
            <li
              key={i}
              className={`grid grid-cols-[70px_32px_1fr] gap-4 py-5 ${
                i < ACTIVITY.length - 1 ? "border-b border-border-base" : ""
              }`}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-secondary">
                {a.time}
              </span>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold text-fg-inverse"
                style={{ backgroundColor: a.color }}
              >
                {a.initials}
              </span>
              <div className="flex flex-col gap-1.5">
                <p className="text-sm text-fg-primary">{a.title}</p>
                <p className="text-[13px] leading-[1.5] text-fg-secondary">
                  {a.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
