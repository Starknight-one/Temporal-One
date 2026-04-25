"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["AI / ML", "DevTools", "Consumer", "B2B", "Hardware", "Other"];

export function CreateProjectButton({
  variant = "primary",
}: {
  variant?: "primary" | "accent";
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          variant === "accent"
            ? "inline-flex items-center justify-center gap-2 self-start rounded-lg bg-accent px-4 py-2.5 text-[13px] font-bold text-fg-primary transition-colors hover:bg-accent-hover"
            : "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-fg-primary px-5 py-3 text-[14px] font-semibold text-fg-inverse transition-opacity hover:opacity-90"
        }
      >
        <PlusIcon />
        Start a project
      </button>
      {open && <CreateProjectModal onClose={() => setOpen(false)} />}
    </>
  );
}

function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [tagsRaw, setTagsRaw] = useState("");
  const [maxMembers, setMaxMembers] = useState(5);
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

  async function onSave() {
    if (!name.trim() || description.trim().length < 10 || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const tags = tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .slice(0, 8);
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          category,
          tags,
          maxMembers,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { team?: { slug?: string } };
      onClose();
      if (data.team?.slug) {
        router.push(`/app/team/${data.team.slug}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "save_failed");
      setSubmitting(false);
    }
  }

  const canSave = name.trim().length >= 2 && description.trim().length >= 10;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={() => !submitting && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="w-full max-w-[560px] overflow-hidden rounded-2xl bg-surface-card shadow-[0_24px_48px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-border-soft px-[22px] py-[18px]">
          <h2
            id={titleId}
            className="font-mono text-[11px] font-bold tracking-[0.15em] text-fg-primary"
          >
            START A PROJECT
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
          <Field label="Project name">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="HireMatch AI"
              maxLength={80}
              disabled={submitting}
              className="w-full rounded-lg border border-border-base bg-surface-card px-3 py-2.5 text-[14px] text-fg-primary outline-none focus:border-accent disabled:bg-surface-card-alt"
            />
            <span className="text-right font-mono text-[10px] text-fg-muted">
              {name.length} / 80
            </span>
          </Field>

          <Field label="What you're building">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="One-line elevator pitch. What problem, who for, what's the bet."
              rows={3}
              maxLength={500}
              disabled={submitting}
              className="w-full resize-none rounded-lg border border-border-base bg-surface-card px-3 py-2.5 text-[13px] leading-[1.5] text-fg-primary outline-none focus:border-accent disabled:bg-surface-card-alt"
            />
            <span className="text-right font-mono text-[10px] text-fg-muted">
              {description.length} / 500 · min 10
            </span>
          </Field>

          <Field label="Category">
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  disabled={submitting}
                  className={`rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    category === c
                      ? "border-accent bg-[#FFF3E0] text-accent"
                      : "border-border-base bg-surface-card text-fg-secondary hover:text-fg-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Tags (comma-separated)">
            <input
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="Go, Postgres, LLM"
              disabled={submitting}
              className="w-full rounded-lg border border-border-base bg-surface-card px-3 py-2.5 text-[13px] text-fg-primary outline-none focus:border-accent disabled:bg-surface-card-alt"
            />
          </Field>

          <Field label="Team size (incl. you)">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                disabled={submitting}
                className="flex-1 accent-accent"
              />
              <span className="w-16 text-right font-mono text-[12px] font-semibold text-fg-primary">
                {maxMembers === 1 ? "Solo" : maxMembers}
              </span>
            </div>
            <span className="font-mono text-[10px] text-fg-muted">
              {maxMembers === 1
                ? "Solo project — no one else can join."
                : "Set to 1 for a solo sprint."}
            </span>
          </Field>

          {error && (
            <div className="rounded-md bg-[#FFEBEE] px-3 py-2 font-mono text-[11px] text-[#C62828]">
              {error}
            </div>
          )}
        </div>

        <footer className="flex items-center gap-3 border-t border-border-soft bg-surface-card-alt px-[22px] py-4">
          <span className="font-mono text-[11px] text-fg-muted">
            🚀 You become the lead
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
            disabled={!canSave || submitting}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-fg-inverse transition-opacity hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create project →"}
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

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
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
