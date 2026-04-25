"use client";

import { useState } from "react";
import {
  PREVIOUS_DAYS,
  PUBLIC_DAY_TAGS,
  SPRINT_DAY,
  SPRINT_TOTAL,
  type LogEntry,
} from "@/lib/admin-data";
import { useLog } from "@/components/admin/LogState";
import { ArtifactPreview, TypePill } from "@/components/admin/shared";

export default function TodayPage() {
  const { entries, openModal } = useLog();
  const [publicShare, setPublicShare] = useState(true);

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-6">
      <StatusBar />

      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent py-4 text-[14px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover"
      >
        <PlusIcon />
        Add log entry
      </button>

      <section className="flex flex-col gap-3.5">
        <SectionHeader
          title="TODAY"
          subtitle="APR 25"
          right={`${entries.length} entries · ${entries.reduce(
            (sum, e) => sum + parseFloat(e.timeSpent),
            0,
          )}h`}
        />
        <div className="flex flex-col gap-3">
          {entries.map((e) => (
            <EntryCard key={e.id} entry={e} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border-base bg-surface-card">
        <div className="flex items-center justify-between border-b border-border-base px-5 py-3">
          <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-fg-secondary">
            PREVIOUS DAYS
          </span>
          <span className="font-mono text-[11px] text-fg-muted">
            6 days · 28 entries · 32h
          </span>
        </div>
        {PREVIOUS_DAYS.map((d) => (
          <div
            key={d.day}
            className="flex items-center gap-4 border-b border-border-soft px-5 py-3 last:border-b-0 hover:bg-surface-card-alt"
          >
            <ChevronRight />
            <span className="w-16 font-mono text-[12px] font-semibold text-fg-primary">
              {d.dateLabel}
            </span>
            <span className="text-[13px] text-fg-secondary">
              {d.entries} entries, {d.hours}
            </span>
            {d.warnings && (
              <span className="ml-auto rounded-full bg-[#FFCDD2] px-2 py-[2px] font-mono text-[10px] font-semibold text-[#C62828]">
                {d.warnings}
              </span>
            )}
            {d.reviewsLabel && (
              <span className="ml-auto font-mono text-[11px] text-fg-muted">
                {d.reviewsLabel}
              </span>
            )}
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border-base bg-surface-card-alt p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-fg-secondary">
            👁  WHAT EMPLOYERS SEE
          </span>
          <a
            href={`/u/anna-${SPRINT_DAY}`}
            className="font-mono text-[11px] font-semibold text-accent hover:underline"
          >
            ↗ TEMPORAL.ONE/ANNA-D{SPRINT_DAY}
          </a>
        </div>
        <div className="flex items-center gap-4">
          <h3 className="font-display text-[28px] font-semibold leading-tight text-fg-primary">
            Day {SPRINT_DAY} of {SPRINT_TOTAL} sprint
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-4 font-mono text-[12px] text-fg-secondary">
          <span>{entries.length + 16} entries</span>
          <span>·</span>
          <span>47h logged</span>
          <span>·</span>
          <span>avg 6.7h/day</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-fg-secondary">
          <span>5/5</span>
          <span>3 docs</span>
          <span>2 designs</span>
          <span>4 conversations</span>
          <span>4 external</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {PUBLIC_DAY_TAGS.map((t) => (
            <span
              key={t.label}
              className="rounded-md border border-border-base bg-surface-card px-2.5 py-1 font-mono text-[11px] text-fg-secondary"
            >
              {t.label} · {t.count}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-border-base pt-4">
          <label className="inline-flex items-center gap-2.5">
            <span
              role="switch"
              aria-checked={publicShare}
              tabIndex={0}
              onClick={() => setPublicShare((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  setPublicShare((v) => !v);
                }
              }}
              className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                publicShare ? "bg-accent" : "bg-border-base"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  publicShare ? "translate-x-[22px]" : "translate-x-[2px]"
                }`}
              />
            </span>
            <span className="text-[13px] font-medium text-fg-primary">
              Project name public
            </span>
          </label>
          <span className="ml-auto" />
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-border-base bg-surface-card px-3 py-1.5 text-[12px] font-medium text-fg-primary hover:bg-surface-card-alt"
          >
            <CopyIcon />
            Copy public link
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-surface-inverse px-3 py-1.5 text-[12px] font-medium text-fg-inverse hover:opacity-90"
          >
            <DownloadIcon />
            Download PDF
          </button>
        </div>
      </section>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border-base bg-border-base sm:grid-cols-4">
      <Cell label="DAY" value={`${SPRINT_DAY} of ${SPRINT_TOTAL}`} />
      <Cell label="STREAK" value="7 days" />
      <Cell label="ACTIVITY TIME" value="4h 23m" />
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

function EntryCard({ entry }: { entry: LogEntry }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border-base bg-surface-card px-5 py-4">
      <div className="flex items-start gap-3">
        <h4 className="flex-1 text-[15px] font-semibold leading-snug text-fg-primary">
          {entry.title}
        </h4>
        <button
          type="button"
          className="text-fg-muted hover:text-fg-primary"
          aria-label="Edit entry"
        >
          ⋯
        </button>
      </div>
      {entry.artifact && <ArtifactPreview artifact={entry.artifact} />}
      <div className="flex flex-wrap items-center gap-3 border-t border-border-soft pt-3 font-mono text-[11px] text-fg-muted">
        <TypePill type={entry.type} />
        <span>{entry.timeSpent}</span>
        <span className="ml-auto">{entry.postedAgo}</span>
      </div>
    </article>
  );
}

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-fg-muted"
      aria-hidden
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function CopyIcon() {
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
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function DownloadIcon() {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
