import Link from "next/link";

type NavKey = "board" | "calendar" | "docs" | "playbook" | "activity";

const NAV: { key: NavKey; label: string; href: string }[] = [
  { key: "board", label: "Board", href: "/dashboard/board" },
  { key: "calendar", label: "Calendar", href: "/dashboard/calendar" },
  { key: "docs", label: "Docs", href: "/dashboard/docs" },
  { key: "playbook", label: "Playbook", href: "/dashboard/playbook" },
  { key: "activity", label: "Activity", href: "/dashboard/activity" },
];

const TEAM = [
  { initials: "SK", name: "Sarah K.", color: "#E879F9" },
  { initials: "MR", name: "Marcus R.", color: "#38BDF8" },
  { initials: "LP", name: "Lisa P.", color: "#FB923C" },
  { initials: "DJ", name: "David J.", color: "#34D399" },
];

export function DashboardSidebar({ active }: { active: NavKey }) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border-base bg-surface-card px-5 py-6">
      <span className="font-mono text-[13px] font-bold uppercase tracking-[0.3em] text-fg-primary">
        Temporal One
      </span>

      <div className="flex items-center gap-2 pt-5">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="text-sm font-semibold text-fg-primary">
          HireMatch AI
        </span>
      </div>

      <nav className="flex flex-col pt-6">
        {NAV.map((n) => {
          const isActive = n.key === active;
          return (
            <Link
              key={n.key}
              href={n.href}
              className={`rounded-md px-2 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-[#39FF1415] font-medium text-accent"
                  : "text-fg-secondary hover:text-fg-primary"
              }`}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="py-2">
        <div className="h-px w-full bg-border-base" />
      </div>

      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-secondary">
        Team
      </span>

      <ul className="flex flex-col gap-2.5 pt-2.5">
        {TEAM.map((m) => (
          <li key={m.initials} className="flex items-center gap-2.5">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-fg-inverse"
              style={{ backgroundColor: m.color }}
            >
              {m.initials}
            </span>
            <span className="text-[13px] text-fg-secondary">{m.name}</span>
          </li>
        ))}
      </ul>

      <div className="flex-1" />

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-secondary">
          Week 3 of 6
        </span>
        <div className="h-1 w-full overflow-hidden rounded-sm bg-border-base">
          <div className="h-full w-1/2 rounded-sm bg-accent" />
        </div>
      </div>
    </aside>
  );
}
