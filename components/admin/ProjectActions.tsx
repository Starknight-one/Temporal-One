"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function JoinButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/teams/${slug}/join`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      router.push(`/app/team/${slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "join_failed");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-lg bg-fg-primary px-4 py-2 text-[13px] font-semibold text-fg-inverse transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Joining…" : "Join project"}
      </button>
      {error && (
        <span className="font-mono text-[10px] text-[#C62828]">{error}</span>
      )}
    </div>
  );
}

export function LeaveButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function onClick() {
    if (busy) return;
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/teams/${slug}/leave`, { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.refresh();
    } catch {
      setBusy(false);
      setConfirm(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        confirm
          ? "border-[#FFCDD2] bg-[#FFEBEE] text-[#C62828]"
          : "border-border-base text-fg-secondary hover:text-fg-primary"
      }`}
    >
      {busy ? "Leaving…" : confirm ? "Tap again to confirm" : "Leave"}
    </button>
  );
}

export function DeleteProjectButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function onClick() {
    if (busy) return;
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/teams/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.refresh();
    } catch {
      setBusy(false);
      setConfirm(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        confirm
          ? "border-[#FFCDD2] bg-[#D32F2F] text-fg-inverse"
          : "border-[#FFCDD2] text-[#C62828] hover:bg-[#FFEBEE]"
      }`}
    >
      {busy
        ? "Deleting…"
        : confirm
          ? "Tap again to delete project"
          : "Delete project"}
    </button>
  );
}
