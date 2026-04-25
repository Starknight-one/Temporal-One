"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { InterestButton } from "@/components/InterestModal";
import type { BuilderLogEntry, LogType } from "@/lib/data";

const FILTERS: { key: "all" | LogType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "code", label: "Code" },
  { key: "doc", label: "Doc" },
  { key: "talk", label: "Talk" },
];

export function ActivityLogCard({
  log,
  totalEntries,
  handle,
  builderName,
}: {
  log: BuilderLogEntry[];
  totalEntries: number;
  handle: string;
  builderName: string;
}) {
  const [filter, setFilter] = useState<"all" | LogType>("all");

  const filtered = filter === "all" ? log : log.filter((r) => r.type === filter);
  const remaining = Math.max(0, totalEntries - log.length);
  const first = builderName.split(" ")[0] || "this builder";

  return (
    <div className="overflow-hidden rounded-2xl border border-border-base bg-surface-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-base px-6 py-4">
        <div className="flex items-center gap-3.5">
          <h2 className="font-display text-lg font-semibold text-fg-primary">
            Recent activity
          </h2>
          <span className="font-mono text-[11px] text-fg-muted">
            {filtered.length} of {totalEntries} visible
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Chip
              key={f.key}
              active={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-border-soft bg-[#FCFCFC] px-6 py-2.5">
        <Col className="w-[50px]">DAY</Col>
        <Col className="flex-1">WHAT · ARTIFACT</Col>
        <Col className="hidden w-[80px] md:block">TIME</Col>
        <Col className="hidden w-[130px] text-right md:block">SCORES</Col>
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-10 text-center font-mono text-[12px] text-fg-muted">
          No entries match this filter.
        </div>
      ) : (
        filtered.map((row, i) => <Row key={i} row={row} />)
      )}

      <Blurred opacity={0.35} />
      <Blurred opacity={0.18} />

      <Paywall
        remaining={remaining}
        handle={handle}
        builderName={builderName}
        first={first}
      />
    </div>
  );
}

function Row({ row }: { row: BuilderLogEntry }) {
  return (
    <div className="flex items-center gap-3 border-b border-border-soft px-6 py-3">
      <span className="w-[50px] flex-none font-mono text-[12px] text-fg-muted">
        d{row.day}
      </span>
      <span className="flex-1 truncate text-[13px] text-[#333]">{row.text}</span>
      <span className="hidden w-[80px] flex-none font-mono text-[11px] text-fg-secondary md:block">
        {row.hours}
      </span>
      <span className="hidden w-[130px] flex-none text-right font-mono text-[11px] font-semibold text-[#3D7B0E] md:block">
        {row.scores}
      </span>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-3 py-[5px] font-mono text-[11px] transition-colors ${
        active
          ? "bg-surface-inverse font-semibold text-fg-inverse"
          : "border border-border-base bg-surface-card-alt text-fg-secondary hover:text-fg-primary"
      }`}
    >
      {children}
    </button>
  );
}

function Col({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-[10px] tracking-[0.2em] text-fg-muted ${className}`}
    >
      {children}
    </span>
  );
}

function Blurred({ opacity }: { opacity: number }) {
  return (
    <div
      className="flex items-center gap-3 border-b border-border-soft px-6 py-3"
      style={{ opacity }}
      aria-hidden
    >
      <span className="w-[50px] flex-none font-mono text-[12px] text-[#CCC]">
        d09
      </span>
      <span className="flex-1 truncate text-[13px] text-[#E5E5E5]">
        ████████ ████████ ████████ ███████ ████ ████████ · ████
      </span>
      <span className="hidden w-[80px] flex-none font-mono text-[11px] text-[#E5E5E5] md:block">
        █h
      </span>
      <span className="hidden w-[130px] flex-none text-right font-mono text-[11px] font-semibold text-[#E5E5E5] md:block">
        █.█ / █.█
      </span>
    </div>
  );
}

function Paywall({
  remaining,
  handle,
  builderName,
  first,
}: {
  remaining: number;
  handle: string;
  builderName: string;
  first: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 border-t border-border-base bg-surface-card-alt px-6 py-8 text-center">
      <LockIcon />
      <h3 className="max-w-[640px] font-display text-2xl font-medium tracking-[-0.01em] text-fg-primary">
        {remaining} more entries from {first}&apos;s run
      </h3>
      <p className="max-w-[560px] text-[13px] text-fg-secondary">
        Each unlocked entry shows the artifact, the work session, and
        peer-verified scores.
      </p>
      <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
        <InterestButton
          intent="unlock-builder"
          target={`${handle} · ${builderName}`}
          className="inline-flex items-center justify-center rounded bg-surface-inverse px-5 py-3 text-[13px] font-semibold text-fg-inverse hover:opacity-90"
        >
          Unlock {first} · $500
        </InterestButton>
        <InterestButton
          intent="pro-monthly"
          target={`${handle} · ${builderName}`}
          className="inline-flex items-center justify-center rounded border border-black bg-surface-card px-5 py-3 text-[13px] font-semibold text-fg-primary hover:bg-surface-card-alt"
        >
          Pro · $200/mo · all builders
        </InterestButton>
      </div>
      <p className="font-mono text-[11px] font-semibold text-accent">
        Hirers: filter by artifact precision in Pro.
      </p>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
