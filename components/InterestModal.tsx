"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useEffect, useState } from "react";

export type Intent =
  | "unlock-project"
  | "unlock-builder"
  | "pro-monthly"
  | "pro-pilot"
  | "for-hirer";

const COPY: Record<Intent, { title: string; sub: string; cta: string }> = {
  "unlock-project": {
    title: "Unlock the full project log",
    sub: "$500 one-time. NDA + admin onboarding included. Drop your email — we'll send the link within 24h.",
    cta: "Request unlock",
  },
  "unlock-builder": {
    title: "Unlock the full builder log",
    sub: "$500 one-time for this builder's full evidence — artifacts, notes, peer scores. NDA included.",
    cta: "Request unlock",
  },
  "pro-monthly": {
    title: "Start Pro · $200/mo",
    sub: "Unlimited reads + artifact search across every live log. Cancel anytime.",
    cta: "Request Pro access",
  },
  "pro-pilot": {
    title: "Talk to us about a company pilot",
    sub: "Bulk access for your hiring team. We onboard you by hand on the first cohort.",
    cta: "Book a pilot intro",
  },
  "for-hirer": {
    title: "Get pilot access",
    sub: "Read 30 days of verified work before you decide. We'll reach out within 24h.",
    cta: "Request access",
  },
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent: Intent;
  target?: string;
  children: ReactNode;
};

export function InterestButton({ intent, target, children, ...rest }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" {...rest} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open && (
        <InterestModal
          intent={intent}
          target={target}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function InterestModal({
  intent,
  target,
  onClose,
}: {
  intent: Intent;
  target?: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const copy = COPY[intent];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent,
          target,
          email,
          company: company || undefined,
          note: note || undefined,
          website,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Something went wrong.");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="interest-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-2xl border border-border-base bg-surface-card shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full text-fg-muted hover:bg-surface-card-alt hover:text-fg-primary"
          aria-label="Close"
        >
          ✕
        </button>

        {done ? (
          <Done onClose={onClose} />
        ) : (
          <div className="flex flex-col gap-4 px-7 py-7">
            <div className="flex flex-col gap-1.5">
              <h2
                id="interest-title"
                className="font-display text-[22px] font-semibold leading-tight tracking-[-0.01em] text-fg-primary"
              >
                {copy.title}
              </h2>
              {target && (
                <span className="font-mono text-[11px] text-fg-muted">
                  {target}
                </span>
              )}
              <p className="text-[13px] leading-[1.55] text-fg-secondary">
                {copy.sub}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="flex flex-col gap-3"
              noValidate
            >
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                <label>
                  Website
                  <input
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>

              <Label>Email</Label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                className="h-11 rounded-lg border border-border-base bg-surface-card-alt px-3.5 text-[14px] text-fg-primary outline-none placeholder:text-fg-muted focus:border-fg-secondary"
              />

              <Label>Company (optional)</Label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your company"
                className="h-11 rounded-lg border border-border-base bg-surface-card-alt px-3.5 text-[14px] text-fg-primary outline-none placeholder:text-fg-muted focus:border-fg-secondary"
              />

              <Label>Note (optional)</Label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything we should know"
                className="rounded-lg border border-border-base bg-surface-card-alt px-3.5 py-3 text-[14px] text-fg-primary outline-none placeholder:text-fg-muted focus:border-fg-secondary"
              />

              {error && (
                <p
                  role="alert"
                  className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-[12px] text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-surface-inverse px-5 text-[13px] font-semibold text-fg-inverse hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending…" : copy.cta}
              </button>
              <p className="text-center font-mono text-[11px] text-fg-muted">
                No payment yet — first we talk.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <label className="font-mono text-[11px] tracking-[0.08em] text-fg-secondary">
      {children}
    </label>
  );
}

function Done({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3.5 px-7 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[20px] font-semibold text-fg-inverse">
        ✓
      </span>
      <h2 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-fg-primary">
        Got it.
      </h2>
      <p className="max-w-[320px] text-[13px] leading-[1.55] text-fg-secondary">
        We&apos;ll reach out within 24h.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 font-mono text-[11px] tracking-[0.2em] text-fg-primary hover:underline"
      >
        CLOSE
      </button>
    </div>
  );
}
