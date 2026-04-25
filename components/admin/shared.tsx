import type { ReactNode } from "react";
import type { EntryType, ArtifactKind, Artifact } from "@/lib/types";

export const TYPE_STYLES: Record<EntryType, { bg: string; fg: string; label: string }> = {
  built: { bg: "#FFE0B2", fg: "#E65100", label: "Built" },
  fixed: { bg: "#FFCDD2", fg: "#C62828", label: "Fixed" },
  researched: { bg: "#BBDEFB", fg: "#1565C0", label: "Researched" },
  designed: { bg: "#C8E6C9", fg: "#2E7D32", label: "Designed" },
  shipped: { bg: "#D1C4E9", fg: "#4527A0", label: "Shipped" },
  blocked: { bg: "#ECEFF1", fg: "#37474F", label: "Blocked" },
};

export function TypePill({ type }: { type: EntryType }) {
  const s = TYPE_STYLES[type];
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-[3px] font-mono text-[10px] font-semibold tracking-[0.06em]"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}

export function ArtifactPreview({ artifact }: { artifact: Artifact }) {
  const icon = ARTIFACT_ICONS[artifact.kind];
  return (
    <a
      href={artifact.href ?? "#"}
      target={artifact.href && artifact.href !== "#" ? "_blank" : undefined}
      rel="noreferrer"
      className="flex items-start gap-3 rounded-lg border border-border-base bg-surface-card-alt px-3.5 py-3 transition-colors hover:bg-surface-card"
    >
      <span className="mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-md bg-surface-card text-fg-secondary">
        {icon}
      </span>
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span className="truncate text-[13px] font-semibold text-fg-primary">
          {artifact.title}
        </span>
        <span className="truncate font-mono text-[11px] text-fg-muted">
          {artifact.meta}
        </span>
      </div>
      <span className="text-fg-muted">
        <ExternalIcon />
      </span>
    </a>
  );
}

const ARTIFACT_ICONS: Record<ArtifactKind, ReactNode> = {
  github: <GithubGlyph />,
  notion: <NotionGlyph />,
  figma: <FigmaGlyph />,
  loom: <LoomGlyph />,
  external: <ExternalIcon />,
};

function GithubGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.4.5.1 5.7.1 12.3c0 5.2 3.4 9.6 8.1 11.2.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.7-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.1.7.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.7-1.6 8.1-6 8.1-11.2C23.9 5.7 18.6.5 12 .5Z" />
    </svg>
  );
}

function NotionGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 7v10" />
      <path d="m8 7 8 10V7" />
    </svg>
  );
}

function FigmaGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5Z" />
      <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2Z" />
      <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0Z" />
      <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0Z" />
      <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5Z" />
    </svg>
  );
}

function LoomGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <polygon points="10 8 16 12 10 16" fill="currentColor" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function Avatar({
  initials,
  bg,
  size = 36,
}: {
  initials: string;
  bg: string;
  size?: number;
}) {
  return (
    <span
      className="inline-flex flex-none items-center justify-center rounded-full font-mono font-semibold text-fg-inverse"
      style={{
        backgroundColor: bg,
        width: size,
        height: size,
        fontSize: Math.round(size * 0.32),
      }}
    >
      {initials}
    </span>
  );
}
