import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const metadata: Metadata = {
  title: "Calendar — Temporal One",
};

type DayMeta = {
  dot?: boolean;
  event?: { label: string; tone: "accent" | "blue" | "orange" };
};

// March 2026 starts on a Sunday. Pencil places "1" in the 7th column (Sun),
// so the first row has 6 empty leading cells.
const DAYS: (DayMeta | null)[] = [
  null, null, null, null, null, null, { event: undefined },
];
const DAY_META: Record<number, DayMeta> = {
  4: { event: { label: "Sprint start", tone: "accent" } },
  9: { dot: true },
  11: { dot: true },
  13: { dot: true },
  16: { dot: true },
  17: { event: { label: "Design Review", tone: "blue" } },
  18: { dot: true },
  20: { dot: true },
  23: { dot: true },
  24: { event: { label: "User Testing", tone: "orange" } },
  25: { dot: true },
  27: { dot: true },
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Upcoming = {
  when: string;
  title: string;
  people: { label: string; dots: string[] } | { label: string; allTeam: true };
};

const UPCOMING: Upcoming[] = [
  {
    when: "Mar 17 · 2:00 PM",
    title: "Design Review",
    people: { label: "Sarah, Marcus", dots: ["#E879F9", "#38BDF8"] },
  },
  {
    when: "Mar 20 · 10:00 AM",
    title: "Standup",
    people: { label: "All team", allTeam: true },
  },
  {
    when: "Mar 24 · 1:00 PM",
    title: "User Testing Session",
    people: { label: "Lisa, Sarah", dots: ["#FB923C", "#E879F9"] },
  },
  {
    when: "Mar 25 · 10:00 AM",
    title: "Standup",
    people: { label: "All team", allTeam: true },
  },
];

export default function CalendarPage() {
  // Build a 42-cell grid: 6 leading empty + 31 days + trailing empty
  const grid: (number | null)[] = [
    ...Array(6).fill(null),
    ...Array.from({ length: 31 }, (_, i) => i + 1),
  ];
  while (grid.length < 42) grid.push(null);
  // Suppress unused-var warning from imports if ever present
  void DAYS;

  return (
    <>
      <DashboardSidebar active="calendar" />
      <main className="flex flex-1 flex-col gap-5 overflow-hidden px-7 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-fg-primary">Calendar</h1>
          <div className="flex items-center gap-4">
            <button className="text-lg text-fg-secondary hover:text-fg-primary">
              ←
            </button>
            <span className="text-base font-semibold text-fg-primary">
              March 2026
            </span>
            <button className="text-lg text-fg-secondary hover:text-fg-primary">
              →
            </button>
          </div>
        </div>

        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* Calendar grid */}
          <div className="flex flex-1 flex-col gap-1">
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="text-center font-mono text-[11px] uppercase tracking-[0.1em] text-fg-secondary"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid flex-1 grid-cols-7 grid-rows-6 gap-1">
              {grid.map((day, i) => {
                const meta = day ? DAY_META[day] : undefined;
                return (
                  <div
                    key={i}
                    className="flex min-h-0 flex-col gap-1 rounded bg-surface-card p-2"
                  >
                    {day !== null && (
                      <>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-fg-secondary">
                            {day}
                          </span>
                          {meta?.dot && (
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                          )}
                        </div>
                        {meta?.event && <EventChip event={meta.event} />}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming panel */}
          <aside className="hidden w-[280px] shrink-0 flex-col gap-4 rounded-lg bg-surface-card p-5 lg:flex">
            <h2 className="text-base font-semibold text-fg-primary">
              Upcoming
            </h2>
            <div className="h-px w-full bg-border-base" />
            {UPCOMING.map((u, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="font-mono text-[11px] tracking-[0.05em] text-fg-secondary">
                  {u.when}
                </span>
                <span className="text-sm font-medium text-fg-primary">
                  {u.title}
                </span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  {"allTeam" in u.people ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  ) : (
                    u.people.dots.map((c, j) => (
                      <span
                        key={j}
                        className="h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: c }}
                      />
                    ))
                  )}
                  <span className="text-[11px] text-fg-secondary">
                    {u.people.label}
                  </span>
                </div>
                {i < UPCOMING.length - 1 && (
                  <div className="mt-3 h-px w-full bg-border-base" />
                )}
              </div>
            ))}
          </aside>
        </div>
      </main>
    </>
  );
}

function EventChip({
  event,
}: {
  event: { label: string; tone: "accent" | "blue" | "orange" };
}) {
  const map = {
    accent: { bg: "#39FF14", color: "#0A0A0A" },
    blue: { bg: "#38BDF822", color: "#38BDF8" },
    orange: { bg: "#FB923C22", color: "#FB923C" },
  } as const;
  const { bg, color } = map[event.tone];
  return (
    <span
      className="truncate rounded-sm px-1 py-0.5 text-[9px] font-medium"
      style={{ backgroundColor: bg, color }}
    >
      {event.label}
    </span>
  );
}
