"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ENTRY_TYPES, type EntryType } from "@/lib/types";

const TYPE_LABELS: Record<EntryType, string> = {
  built: "Built",
  fixed: "Fixed",
  researched: "Researched",
  designed: "Designed",
  shipped: "Shipped",
  blocked: "Blocked",
};

export type LogEntryTeamOption = { id: string; slug: string; name: string };

export function AddLogEntryButton({
  className,
  children,
  teams = [],
  initialTeamId,
  lockTeam = false,
}: {
  className?: string;
  children?: React.ReactNode;
  teams?: LogEntryTeamOption[];
  initialTeamId?: string;
  lockTeam?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex items-center justify-center gap-2 rounded-xl bg-accent py-4 text-[14px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover"
        }
      >
        {children ?? (
          <>
            <PlusIcon />
            Add log entry
          </>
        )}
      </button>
      {open && (
        <AddLogEntryModal
          teams={teams}
          initialTeamId={initialTeamId}
          lockTeam={lockTeam}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function AddLogEntryModal({
  onClose,
  teams,
  initialTeamId,
  lockTeam,
}: {
  onClose: () => void;
  teams: LogEntryTeamOption[];
  initialTeamId?: string;
  lockTeam: boolean;
}) {
  const titleId = useId();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [artifactUrl, setArtifactUrl] = useState("");
  const [type, setType] = useState<EntryType>("built");
  const [hours, setHours] = useState(3);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [teamId, setTeamId] = useState<string>(
    initialTeamId ?? teams[0]?.id ?? "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, submitting]);

  const detected = useMemo(() => {
    const m = artifactUrl.match(/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/);
    if (!m) return null;
    return {
      shortUrl: `github.com/${m[1]}/pull/${m[2]}`,
      number: m[2],
    };
  }, [artifactUrl]);

  async function onSave() {
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/log-entries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          type,
          timeSpent: hours,
          artifactUrl: artifactUrl.trim() || undefined,
          note: note.trim() || undefined,
          teamId: teamId || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "save_failed");
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={() => !submitting && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-surface-card shadow-[0_24px_48px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-border-soft px-[22px] py-[18px]">
          <h2
            id={titleId}
            className="font-mono text-[11px] font-bold tracking-[0.15em] text-fg-primary"
          >
            NEW LOG ENTRY
          </h2>
          <button
            type="button"
            onClick={() => !submitting && onClose()}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-fg-secondary hover:bg-surface-card-alt hover:text-fg-primary"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="flex flex-col gap-5 px-[22px] py-[22px]">
          {teams.length > 0 && (
            <Field label="Project">
              {lockTeam && teams.length === 1 ? (
                <span className="inline-flex items-center gap-2 rounded-md border border-border-base bg-surface-card-alt px-3 py-2 text-[13px] font-medium text-fg-primary">
                  <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                  {teams[0].name}
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {teams.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTeamId(t.id)}
                      disabled={submitting}
                      className={`rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                        teamId === t.id
                          ? "border-accent bg-[#FFF3E0] text-accent"
                          : "border-border-base bg-surface-card text-fg-secondary hover:text-fg-primary"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </Field>
          )}
          <Field label="What did you do?">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Built login form with OAuth"
              maxLength={200}
              disabled={submitting}
              className="w-full rounded-lg border border-accent bg-surface-card px-3 py-2.5 text-[14px] text-fg-primary outline-none focus:border-accent disabled:bg-surface-card-alt"
            />
            <span className="text-right font-mono text-[10px] text-fg-muted">
              {title.length} / 200
            </span>
          </Field>

          <Field label="Artifact">
            <div className="flex items-center gap-2 rounded-lg border border-border-base bg-surface-card-alt px-3 py-2.5">
              <LinkIcon />
              <input
                value={artifactUrl}
                onChange={(e) => setArtifactUrl(e.target.value)}
                placeholder="github.com/team42/hirematch/pull/142"
                disabled={submitting}
                className="flex-1 bg-transparent text-[13px] text-fg-primary outline-none placeholder:text-fg-muted"
              />
            </div>
            {detected && (
              <div className="flex items-start gap-2 rounded-lg border border-[#C8E6C9] bg-[#F1F8E9] px-3 py-2.5">
                <CheckIcon />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-semibold text-[#2E7D32]">
                    Detected: GitHub PR #{detected.number}
                  </span>
                  <span className="font-mono text-[11px] text-[#558B2F]">
                    we&apos;ll link this to your entry
                  </span>
                </div>
              </div>
            )}
          </Field>

          <Field label="Type">
            <div className="flex flex-wrap gap-1.5">
              {ENTRY_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  disabled={submitting}
                  className={`rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    type === t
                      ? "border-accent bg-[#FFF3E0] text-accent"
                      : "border-border-base bg-surface-card text-fg-secondary hover:text-fg-primary"
                  }`}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Time spent">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.5}
                max={8}
                step={0.5}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                disabled={submitting}
                className="flex-1 accent-accent"
              />
              <span className="w-12 text-right font-mono text-[12px] font-semibold text-fg-primary">
                {hours}h
              </span>
            </div>
          </Field>

          {showNote ? (
            <Field label="Note">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional context — what made this hard, who helped, what's next."
                rows={3}
                disabled={submitting}
                className="w-full resize-none rounded-lg border border-border-base bg-surface-card px-3 py-2.5 text-[13px] text-fg-primary outline-none focus:border-accent"
              />
            </Field>
          ) : (
            <button
              type="button"
              onClick={() => setShowNote(true)}
              className="self-start text-[13px] font-medium text-fg-secondary hover:text-fg-primary"
            >
              + Add note (optional)
            </button>
          )}

          {error && (
            <div className="rounded-md bg-[#FFEBEE] px-3 py-2 font-mono text-[11px] text-[#C62828]">
              {error}
            </div>
          )}
        </div>

        <footer className="flex items-center gap-3 border-t border-border-soft bg-surface-card-alt px-[22px] py-4">
          <span className="font-mono text-[11px] text-fg-muted">
            🔒 Cannot edit after 1 hour
          </span>
          <span className="ml-auto" />
          <button
            type="button"
            onClick={() => !submitting && onClose()}
            className="rounded-md px-4 py-2 text-[13px] font-medium text-fg-secondary hover:text-fg-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!title.trim() || submitting}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-fg-inverse transition-opacity hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save entry →"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] font-semibold tracking-[0.15em] text-fg-secondary">
        {label.toUpperCase()}
      </span>
      {children}
    </div>
  );
}

function LinkIcon() {
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
      className="text-fg-muted"
      aria-hidden
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon() {
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
      className="text-[#2E7D32]"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
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
