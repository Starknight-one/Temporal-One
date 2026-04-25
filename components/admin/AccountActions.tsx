"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";

export function EditProfileButton({
  initialName,
  initialHandle,
}: {
  initialName: string;
  initialHandle: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-border-base px-3.5 py-2 text-[13px] font-medium text-fg-primary hover:bg-surface-card-alt"
      >
        Edit profile
      </button>
      {open && (
        <EditProfileModal
          initialName={initialName}
          initialHandle={initialHandle}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function EditProfileModal({
  initialName,
  initialHandle,
  onClose,
}: {
  initialName: string;
  initialHandle: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [handle, setHandle] = useState(initialHandle);
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
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim(), handle: handle.trim() }),
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
        className="w-full max-w-[440px] overflow-hidden rounded-2xl bg-surface-card shadow-[0_24px_48px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-border-soft px-[22px] py-[18px]">
          <h2
            id={titleId}
            className="font-mono text-[11px] font-bold tracking-[0.15em] text-fg-primary"
          >
            EDIT PROFILE
          </h2>
        </header>
        <div className="flex flex-col gap-5 px-[22px] py-[22px]">
          <Field label="Name">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              disabled={submitting}
              className="w-full rounded-lg border border-border-base bg-surface-card px-3 py-2.5 text-[14px] text-fg-primary outline-none focus:border-accent disabled:bg-surface-card-alt"
            />
          </Field>
          <Field label="Handle">
            <div className="flex items-center gap-2 rounded-lg border border-border-base bg-surface-card px-3 py-2.5">
              <span className="font-mono text-[13px] text-fg-muted">@</span>
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                maxLength={32}
                disabled={submitting}
                className="flex-1 bg-transparent text-[14px] text-fg-primary outline-none"
              />
            </div>
            <span className="font-mono text-[10px] text-fg-muted">
              lowercase, letters/numbers/dashes
            </span>
          </Field>
          {error && (
            <div className="rounded-md bg-[#FFEBEE] px-3 py-2 font-mono text-[11px] text-[#C62828]">
              {error === "handle_taken" ? "That handle is taken." : error}
            </div>
          )}
        </div>
        <footer className="flex items-center gap-3 border-t border-border-soft bg-surface-card-alt px-[22px] py-4">
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
            disabled={submitting || (!name.trim() && !handle.trim())}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-fg-inverse transition-opacity hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save"}
          </button>
        </footer>
      </div>
    </div>
  );
}

export function DeleteAccountButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function onConfirm() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/me", { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Sign out and bounce home.
      router.push("/api/auth/signout?callbackUrl=/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "delete_failed");
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-[#D32F2F] px-4 py-2.5 text-[13px] font-semibold text-fg-inverse hover:bg-[#B71C1C]"
      >
        <TrashIcon />
        Delete account
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => !submitting && setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[460px] overflow-hidden rounded-2xl bg-surface-card shadow-[0_24px_48px_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center gap-2 border-b border-[#FFCDD2] bg-[#FFF5F5] px-[22px] py-[18px]">
              <span className="font-mono text-[11px] font-bold tracking-[0.15em] text-[#C62828]">
                DELETE ACCOUNT
              </span>
            </header>
            <div className="flex flex-col gap-4 px-[22px] py-[22px]">
              <p className="text-[14px] leading-[1.5] text-fg-primary">
                Your profile, log entries, and team memberships are scheduled
                for hard-deletion in 7 days. You can recover by signing in
                before then.
              </p>
              <p className="text-[13px] text-fg-secondary">
                Type <span className="font-mono font-semibold">delete</span> to
                confirm.
              </p>
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete"
                disabled={submitting}
                className="w-full rounded-lg border border-border-base bg-surface-card px-3 py-2.5 text-[14px] text-fg-primary outline-none focus:border-[#D32F2F]"
              />
              {error && (
                <div className="rounded-md bg-[#FFEBEE] px-3 py-2 font-mono text-[11px] text-[#C62828]">
                  {error}
                </div>
              )}
            </div>
            <footer className="flex items-center gap-3 border-t border-border-soft bg-surface-card-alt px-[22px] py-4">
              <span className="ml-auto" />
              <button
                type="button"
                onClick={() => !submitting && setOpen(false)}
                className="rounded-md px-4 py-2 text-[13px] font-medium text-fg-secondary hover:text-fg-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={submitting || confirmText !== "delete"}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#D32F2F] px-4 py-2 text-[13px] font-semibold text-fg-inverse hover:bg-[#B71C1C] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Deleting…" : "Delete account"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
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

function TrashIcon() {
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
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
