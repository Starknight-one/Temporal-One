"use client";

import type { ReactNode } from "react";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "success"; email: string };

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Something went wrong. Try again.");
      }
      setState({ kind: "success", email });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  return (
    <>
      <LandingHeader current="signin" />
      <main className="bg-surface-primary">
        <Center>
          {state.kind === "success" ? (
            <Success email={state.email} />
          ) : (
            <Card>
              <header className="flex flex-col items-center gap-2 px-8 pb-5 pt-9 text-center">
                <span className="font-mono text-[11px] tracking-[0.35em] text-fg-muted">
                  WELCOME
                </span>
                <h1 className="font-display text-[28px] font-semibold tracking-[-0.01em] text-fg-primary">
                  Sign in to Temporal One
                </h1>
                <p className="text-[13px] leading-[1.5] text-fg-secondary">
                  Sign-in is hand-handled for cohort #1. Enter your email — we&apos;ll
                  reply with your access link within 24h.
                </p>
              </header>

              <form
                onSubmit={onSubmit}
                className="flex flex-col gap-3.5 px-8 pb-3 pt-2"
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

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="font-mono text-[11px] tracking-[0.08em] text-fg-secondary"
                  >
                    Email
                  </label>
                  <div className="flex items-center gap-2.5 rounded-lg border border-border-base bg-surface-card-alt px-3.5 py-3 focus-within:border-fg-secondary">
                    <MailIcon />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@studio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent text-[14px] text-fg-primary outline-none placeholder:text-fg-muted"
                    />
                  </div>
                </div>

                {state.kind === "error" && (
                  <p
                    role="alert"
                    className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-[12px] text-red-700"
                  >
                    {state.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={state.kind === "submitting"}
                  className="mt-1 inline-flex items-center justify-center rounded-full bg-surface-inverse px-5 py-3.5 text-[14px] font-semibold text-fg-inverse transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state.kind === "submitting" ? "Sending…" : "Request a sign-in link"}
                </button>

                <p className="text-center font-mono text-[11px] text-fg-muted">
                  No password. We&apos;ll email you a one-time link.
                </p>
              </form>

              <footer className="flex items-center justify-center gap-1.5 border-t border-border-base px-8 py-4">
                <span className="text-[12px] text-fg-muted">
                  By continuing you agree to the
                </span>
                <Link href="/how-it-works" className="text-[12px] font-medium text-fg-primary hover:underline">
                  log policy
                </Link>
              </footer>
            </Card>
          )}
        </Center>

        <Aside />
      </main>
      <Footer />
    </>
  );
}

function Center({ children }: { children: ReactNode }) {
  return (
    <section className="flex justify-center px-6 pb-10 pt-12 sm:px-12 md:px-20">
      {children}
    </section>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-border-base bg-surface-card">
      {children}
    </div>
  );
}

function Success({ email }: { email: string }) {
  return (
    <Card>
      <div className="flex flex-col items-center gap-4 px-8 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[20px] font-semibold text-fg-inverse">
          ✓
        </span>
        <h2 className="font-display text-[24px] font-semibold tracking-[-0.01em] text-fg-primary">
          Check your email
        </h2>
        <p className="max-w-[320px] text-[13px] leading-[1.55] text-fg-secondary">
          We sent a confirmation to <span className="font-semibold text-fg-primary">{email}</span>.
          We&apos;ll reply with your sign-in link within 24h.
        </p>
        <Link
          href="/"
          className="mt-2 font-mono text-[11px] tracking-[0.2em] text-fg-primary hover:underline"
        >
          BACK TO THE FEED →
        </Link>
      </div>
    </Card>
  );
}

function Aside() {
  const items = [
    {
      h: "Builders & leaders",
      d: "Sign in to land in your team dashboard, board, calendar, and daily log.",
    },
    {
      h: "Hirers",
      d: "Sign in to manage unlocked logs, NDA copies, and your saved candidates.",
    },
    {
      h: "No invite yet?",
      d: "Apply to the next cohort or unlock a single log to read what's already shipped.",
    },
  ];
  return (
    <section className="px-6 pb-10 sm:px-12 md:px-20">
      <div className="mx-auto grid max-w-[1200px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <article
            key={it.h}
            className="flex flex-col gap-2 rounded-xl border border-border-base bg-surface-card px-5 py-4"
          >
            <h3 className="text-[13px] font-semibold text-fg-primary">{it.h}</h3>
            <p className="text-[12px] leading-[1.5] text-fg-secondary">{it.d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#999"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
