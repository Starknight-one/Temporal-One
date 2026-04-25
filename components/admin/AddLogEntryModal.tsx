"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useLog } from "./LogState";
import type { EntryType } from "@/lib/admin-data";

const TYPES: { key: EntryType; label: string }[] = [
  { key: "built", label: "Built" },
  { key: "fixed", label: "Fixed" },
  { key: "researched", label: "Researched" },
  { key: "designed", label: "Designed" },
  { key: "shipped", label: "Shipped" },
  { key: "blocked", label: "Blocked" },
];

export function AddLogEntryModal() {
  const { modalOpen, closeModal, addEntry } = useLog();
  const titleId = useId();
  const [title, setTitle] = useState("");
  const [artifactUrl, setArtifactUrl] = useState("");
  const [type, setType] = useState<EntryType>("built");
  const [hours, setHours] = useState(3);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen, closeModal]);

  useEffect(() => {
    if (!modalOpen) {
      setTitle("");
      setArtifactUrl("");
      setType("built");
      setHours(3);
      setShowNote(false);
      setNote("");
    }
  }, [modalOpen]);

  const detected = useMemo(() => {
    const m = artifactUrl.match(/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/);
    if (!m) return null;
    return {
      shortUrl: `github.com/${m[1]}/pull/${m[2]}`,
      number: m[2],
    };
  }, [artifactUrl]);

  if (!modalOpen) return null;

  function onSave() {
    if (!title.trim()) return;
    addEntry({
      title: title.trim(),
      type,
      timeSpent: `${hours}h`,
      artifactUrl: artifactUrl.trim() || undefined,
      note: note.trim() || undefined,
    });
    closeModal();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={closeModal}
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
            onClick={closeModal}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-fg-secondary hover:bg-surface-card-alt hover:text-fg-primary"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="flex flex-col gap-5 px-[22px] py-[22px]">
          <Field label="What did you do?">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Built login form with OAuth"
              maxLength={200}
              className="w-full rounded-lg border border-accent bg-surface-card px-3 py-2.5 text-[14px] text-fg-primary outline-none focus:border-accent"
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
                    we'll link this to your entry
                  </span>
                </div>
              </div>
            )}
          </Field>

          <Field label="Type">
            <div className="flex flex-wrap gap-1.5">
              {TYPES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setType(t.key)}
                  className={`rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    type === t.key
                      ? "border-accent bg-[#FFF3E0] text-accent"
                      : "border-border-base bg-surface-card text-fg-secondary hover:text-fg-primary"
                  }`}
                >
                  {t.label}
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
        </div>

        <footer className="flex items-center gap-3 border-t border-border-soft bg-surface-card-alt px-[22px] py-4">
          <span className="font-mono text-[11px] text-fg-muted">
            🔒 Cannot edit after 1 hour
          </span>
          <span className="ml-auto" />
          <button
            type="button"
            onClick={closeModal}
            className="rounded-md px-4 py-2 text-[13px] font-medium text-fg-secondary hover:text-fg-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!title.trim()}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-fg-inverse transition-opacity hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save entry →
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
