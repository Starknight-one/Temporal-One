"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { InboxItem } from "@/lib/admin-data";
import { useInbox } from "@/components/admin/InboxState";

type Tab = "all" | "mentions" | "reminders" | "info";

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "mentions", label: "Mentions" },
  { key: "reminders", label: "Reminders" },
  { key: "info", label: "Info" },
];

const KIND_TO_TAB: Record<InboxItem["kind"], Tab> = {
  warning: "reminders",
  reminder: "reminders",
  feedback: "mentions",
  mention: "mentions",
  info: "info",
};

const GROUP_LABEL: Record<InboxItem["group"], string> = {
  today: "TODAY",
  yesterday: "YESTERDAY",
  earlier: "EARLIER THIS WEEK",
};

export default function InboxPage() {
  const { items, markAllRead, markRead } = useInbox();
  const [tab, setTab] = useState<Tab>("all");

  const visible = useMemo(
    () => (tab === "all" ? items : items.filter((it) => KIND_TO_TAB[it.kind] === tab)),
    [items, tab],
  );

  const grouped = useMemo(() => {
    const out: Record<InboxItem["group"], InboxItem[]> = { today: [], yesterday: [], earlier: [] };
    for (const it of visible) out[it.group].push(it);
    return out;
  }, [visible]);

  const unread = items.filter((it) => !it.read).length;

  const counts: Record<Tab, number> = {
    all: items.filter((it) => !it.read).length,
    mentions: items.filter((it) => !it.read && KIND_TO_TAB[it.kind] === "mentions").length,
    reminders: items.filter((it) => !it.read && KIND_TO_TAB[it.kind] === "reminders").length,
    info: items.filter((it) => !it.read && KIND_TO_TAB[it.kind] === "info").length,
  };

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[34px] font-semibold leading-tight text-fg-primary">
            Inbox
          </h1>
          <span className="font-mono text-[11px] text-fg-muted">
            {unread} unread · last 24h
          </span>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unread === 0}
          className="font-mono text-[11px] font-medium text-accent hover:underline disabled:cursor-not-allowed disabled:text-fg-muted"
        >
          ✓ Mark all read
        </button>
      </header>

      <div className="flex gap-1 self-start rounded-full border border-border-base bg-surface-card-alt p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${
              tab === t.key
                ? "bg-surface-inverse text-fg-inverse"
                : "text-fg-secondary hover:text-fg-primary"
            }`}
          >
            {t.label}
            {counts[t.key] > 0 && (
              <span
                className={`rounded-full px-1.5 py-[1px] font-mono text-[10px] font-semibold ${
                  tab === t.key
                    ? "bg-fg-inverse/20 text-fg-inverse"
                    : "bg-[#FFEBEE] text-[#C62828]"
                }`}
              >
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        {(["today", "yesterday", "earlier"] as const).map((group) => {
          const list = grouped[group];
          if (list.length === 0) return null;
          return (
            <section key={group} className="flex flex-col gap-2">
              <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-fg-muted">
                {GROUP_LABEL[group]}
              </span>
              <div className="flex flex-col gap-2">
                {list.map((it) => (
                  <InboxRow key={it.id} item={it} onSeen={() => markRead(it.id)} />
                ))}
              </div>
            </section>
          );
        })}
        {visible.length === 0 && (
          <div className="rounded-xl border border-dashed border-border-base bg-surface-card-alt px-6 py-10 text-center">
            <p className="font-mono text-[12px] text-fg-muted">
              Nothing here. Switch tabs or come back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function InboxRow({ item, onSeen }: { item: InboxItem; onSeen: () => void }) {
  const tone = TONE[item.kind];
  return (
    <article
      className={`flex items-start gap-3 rounded-xl border bg-surface-card px-4 py-3.5 ${
        item.read ? "border-border-soft opacity-90" : "border-border-base"
      }`}
    >
      <span
        className={`mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full ${tone.bg} ${tone.fg}`}
      >
        {tone.icon}
      </span>
      <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
        <div className="flex items-center gap-2">
          {!item.read && (
            <span className="inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent" />
          )}
          <span className="text-[14px] font-semibold text-fg-primary">
            {item.title}
          </span>
        </div>
        {item.body && (
          <p className="text-[13px] leading-snug text-fg-secondary">
            {item.body}
          </p>
        )}
        {item.cta && (
          <Link
            href={item.cta.href}
            onClick={onSeen}
            className="self-start rounded-md bg-accent px-3 py-1 text-[12px] font-semibold text-fg-inverse hover:bg-accent-hover"
          >
            {item.cta.label}
          </Link>
        )}
      </div>
      <span className="ml-2 flex-none font-mono text-[11px] text-fg-muted">
        {item.timeAgo}
      </span>
    </article>
  );
}

const TONE: Record<
  InboxItem["kind"],
  { bg: string; fg: string; icon: React.ReactNode }
> = {
  warning: { bg: "bg-[#FFF3E0]", fg: "text-accent", icon: <WarnIcon /> },
  reminder: { bg: "bg-[#FFF3E0]", fg: "text-accent", icon: <BellIcon /> },
  feedback: { bg: "bg-[#E1BEE7]", fg: "text-[#7B1FA2]", icon: <ChatIcon /> },
  mention: { bg: "bg-[#BBDEFB]", fg: "text-[#1565C0]", icon: <ChatIcon /> },
  info: { bg: "bg-surface-card-alt", fg: "text-fg-secondary", icon: <InfoIcon /> },
};

function WarnIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
