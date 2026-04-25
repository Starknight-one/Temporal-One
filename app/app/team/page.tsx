"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ME_HANDLE,
  SPRINT_DAY,
  SPRINT_TOTAL,
  TEAM_FEED,
  TEAM_MEMBERS,
  TEAM_NAME,
  PROJECT_NAME,
  getMember,
  type FeedItem,
  type Member,
} from "@/lib/admin-data";
import { useLog } from "@/components/admin/LogState";
import { ArtifactPreview, Avatar, TypePill } from "@/components/admin/shared";

export default function TeamPage() {
  const { openModal } = useLog();
  const [feed, setFeed] = useState<FeedItem[]>(TEAM_FEED);

  function setReview(id: string, state: FeedItem["reviewState"]) {
    setFeed((prev) => prev.map((it) => (it.id === id ? { ...it, reviewState: state } : it)));
  }

  return (
    <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="flex flex-col gap-3 rounded-xl border border-border-base bg-surface-card p-5">
        <div className="flex flex-col gap-1.5 border-b border-border-base pb-4">
          <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-fg-muted">
            {TEAM_NAME.toUpperCase()}
          </span>
          <span className="font-display text-[18px] font-semibold text-fg-primary">
            {PROJECT_NAME}
          </span>
          <span className="font-mono text-[11px] text-fg-secondary">
            Day {SPRINT_DAY} of {SPRINT_TOTAL}
          </span>
        </div>
        <ul className="flex flex-col gap-2 pt-1">
          {TEAM_MEMBERS.map((m) => (
            <MemberRow key={m.handle} member={m} />
          ))}
        </ul>
        <button
          type="button"
          onClick={() => (window.location.href = "/app/reviews")}
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-[13px] font-semibold text-fg-inverse hover:bg-accent-hover"
        >
          Review teammates →
        </button>
        <div className="flex items-center gap-3 border-t border-border-base pt-3 font-mono text-[11px] text-fg-secondary">
          <button type="button" className="hover:text-fg-primary">
            Settings
          </button>
          <span className="text-fg-muted">·</span>
          <button type="button" className="hover:text-fg-primary">
            Leave team
          </button>
        </div>
      </aside>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-fg-primary">
              TODAY
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-fg-muted">
              ·  APR 25
            </span>
          </div>
          <span className="font-mono text-[11px] text-fg-muted">All teammates</span>
        </div>

        <div className="flex flex-col gap-3">
          {feed.map((item) => (
            <FeedCard
              key={item.id}
              item={item}
              onMark={(state) => setReview(item.id, state)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-1 pt-4 font-mono text-[11px] text-fg-muted">
          <button type="button" className="self-start hover:text-fg-primary">
            ▾ YESTERDAY · APR 24 · 12 entries from team
          </button>
          <button type="button" className="self-start hover:text-fg-primary">
            ▸ APR 23 · 8 entries from team
          </button>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={openModal}
            className="font-mono text-[11px] font-semibold text-accent hover:underline"
          >
            + Add your own log entry
          </button>
        </div>
      </section>
    </div>
  );
}

function MemberRow({ member }: { member: Member }) {
  const isMe = member.handle === ME_HANDLE;
  const dotColor =
    member.status === "logged-today" || member.status === "lead"
      ? "#2E7D32"
      : member.status === "returned"
        ? "#FF9800"
        : "#C62828";
  return (
    <li
      className={`flex items-center gap-2.5 rounded-lg px-2 py-2 ${
        isMe ? "bg-[#FFF3E0]" : "hover:bg-surface-card-alt"
      }`}
    >
      <Avatar initials={member.initials} bg={member.avatarBg} size={32} />
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-fg-primary">
          {member.name}
          {member.isLead && (
            <span className="rounded-sm bg-accent px-1 py-[1px] font-mono text-[8px] font-bold tracking-[0.1em] text-fg-inverse">
              LEAD
            </span>
          )}
          {isMe && (
            <span className="font-mono text-[10px] font-medium text-fg-muted">
              · you
            </span>
          )}
        </span>
        <span className="flex items-center gap-1.5 truncate font-mono text-[10px] text-fg-secondary">
          <span
            className="inline-block h-1.5 w-1.5 flex-none rounded-full"
            style={{ backgroundColor: dotColor }}
          />
          {member.statusLabel}
        </span>
      </div>
    </li>
  );
}

function FeedCard({
  item,
  onMark,
}: {
  item: FeedItem;
  onMark: (state: FeedItem["reviewState"]) => void;
}) {
  const author = getMember(item.authorHandle);
  if (!author) return null;
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border-base bg-surface-card px-5 py-4">
      <header className="flex items-center gap-3">
        <Avatar initials={author.initials} bg={author.avatarBg} size={32} />
        <div className="flex flex-col">
          <span className="flex items-center gap-2 text-[14px] font-semibold text-fg-primary">
            {author.name}
            {author.isLead && (
              <span className="rounded-sm bg-accent px-1 py-[1px] font-mono text-[8px] font-bold tracking-[0.1em] text-fg-inverse">
                LEAD
              </span>
            )}
          </span>
          <span className="font-mono text-[11px] text-fg-muted">
            {item.postedAt}
          </span>
        </div>
        <span className="ml-auto text-[14px] font-medium text-fg-primary">
          {item.title}
        </span>
      </header>
      {item.artifact && <ArtifactPreview artifact={item.artifact} />}
      <div className="flex flex-wrap items-center gap-3 border-t border-border-soft pt-3 font-mono text-[11px] text-fg-secondary">
        <TypePill type={item.type} />
        {item.metric && <span>{item.metric}</span>}
        <span className="ml-auto" />
        {author.handle === ME_HANDLE ? (
          <span className="font-mono text-[11px] text-fg-muted">your entry</span>
        ) : item.reviewState === "reviewed" ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#F1F8E9] px-2 py-1 font-mono text-[11px] font-semibold text-[#2E7D32]">
            ✓ You reviewed
          </span>
        ) : item.reviewState === "skipped" ? (
          <button
            type="button"
            onClick={() => onMark("reviewed")}
            className="rounded-md border border-border-base bg-surface-card px-3 py-1 text-[12px] text-fg-secondary hover:text-fg-primary"
          >
            Skipped · undo
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onMark("skipped")}
              className="rounded-md border border-border-base bg-surface-card px-3 py-1 text-[12px] text-fg-secondary hover:text-fg-primary"
            >
              Skip
            </button>
            <Link
              href="/app/reviews"
              onClick={() => onMark("reviewed")}
              className="rounded-md bg-surface-inverse px-3 py-1 text-[12px] font-semibold text-fg-inverse hover:opacity-90"
            >
              Review
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
