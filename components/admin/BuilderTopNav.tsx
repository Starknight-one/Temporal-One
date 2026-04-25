"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  ME_HANDLE,
  PROJECT_NAME,
  SPRINT_DAY,
  SPRINT_TOTAL,
  TEAM_NAME,
  getMember,
} from "@/lib/admin-data";
import { useUnreadInboxCount } from "./InboxState";
import { usePendingReviewCount } from "./ReviewsState";

type Item = { href: string; label: string; icon?: ReactNode };

const ITEMS: Item[] = [
  { href: "/app/today", label: "Today" },
  { href: "/app/team", label: "Team" },
  { href: "/app/playbook", label: "Playbook" },
  { href: "/app/reviews", label: "Reviews" },
  { href: "/app/inbox", label: "Inbox", icon: <InboxIcon /> },
];

export function BuilderTopNav() {
  const pathname = usePathname();
  const me = getMember(ME_HANDLE);
  const unread = useUnreadInboxCount();
  const pending = usePendingReviewCount();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-6 border-b border-border-base bg-surface-card px-6 sm:px-10">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="font-mono text-[13px] font-bold tracking-[0.32em] text-fg-primary"
        >
          TEMPORAL ONE
        </Link>
        <span className="hidden h-6 w-px bg-border-base sm:inline-block" />
        <span className="hidden items-center gap-2 sm:inline-flex">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          <span className="text-[13px] font-medium text-fg-primary">
            {TEAM_NAME} · {PROJECT_NAME}
          </span>
        </span>
      </div>

      <nav className="ml-auto flex items-center gap-1">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          const badge =
            item.label === "Reviews" && pending > 0
              ? pending
              : item.label === "Inbox" && unread > 0
                ? unread
                : undefined;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[13px] transition-colors ${
                active
                  ? "bg-[#FFF3E0] font-semibold text-accent"
                  : "text-fg-secondary hover:text-fg-primary"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {badge !== undefined && (
                <span className="rounded-full bg-[#FFEBEE] px-1.5 py-[1px] font-mono text-[10px] font-semibold text-[#C62828]">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="ml-2 flex items-center gap-3">
        <span className="hidden font-mono text-[11px] tracking-[0.1em] text-fg-secondary sm:inline-block">
          Day {SPRINT_DAY} of {SPRINT_TOTAL}
        </span>
        <span className="h-5 w-px bg-border-base" />
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-border-base bg-surface-card py-[3px] pl-3 pr-[3px] hover:bg-surface-card-alt"
          aria-label="Account"
        >
          <span className="font-mono text-[11px] font-semibold text-fg-primary">
            {me?.initials ?? "ME"}
          </span>
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-fg-inverse"
            style={{ backgroundColor: me?.avatarBg ?? "#FF9800" }}
          />
        </button>
      </div>
    </header>
  );
}

function InboxIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
    </svg>
  );
}
