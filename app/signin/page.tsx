import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sign in — Temporal One",
  description: "Sign in to Temporal One.",
};

export default function SignInPage() {
  return (
    <>
      <LandingHeader current="signin" />
      <main className="bg-surface-primary">
        <Center />
        <Aside />
      </main>
      <Footer />
    </>
  );
}

function Center() {
  return (
    <section className="flex justify-center px-6 pb-10 pt-12 sm:px-12 md:px-20">
      <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-border-base bg-surface-card">
        <header className="flex flex-col items-center gap-2 px-8 pb-5 pt-9 text-center">
          <span className="font-mono text-[11px] tracking-[0.35em] text-fg-muted">
            WELCOME
          </span>
          <h1 className="font-display text-[28px] font-semibold tracking-[-0.01em] text-fg-primary">
            Sign in to Temporal One
          </h1>
          <p className="text-[13px] leading-[1.5] text-fg-secondary">
            New here? An account is created automatically on first sign-in.
          </p>
        </header>

        <Tabs />

        <div className="flex flex-col gap-2.5 px-8">
          <SocialButton variant="google">Continue with Google</SocialButton>
          <SocialButton variant="telegram">Continue with Telegram</SocialButton>
        </div>

        <div className="flex items-center gap-3.5 px-8 py-4">
          <div className="h-px flex-1 bg-border-base" />
          <span className="font-mono text-[11px] text-fg-muted">
            or magic link
          </span>
          <div className="h-px flex-1 bg-border-base" />
        </div>

        <form
          className="flex flex-col gap-3.5 px-8 pb-3"
          action="/dashboard/board"
          method="get"
        >
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
                className="flex-1 bg-transparent text-[14px] text-fg-primary outline-none placeholder:text-fg-muted"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-1 inline-flex items-center justify-center rounded-full bg-surface-inverse px-5 py-3.5 text-[14px] font-semibold text-fg-inverse transition-colors hover:opacity-90"
          >
            Send me a magic link
          </button>

          <p className="text-center font-mono text-[11px] text-fg-muted">
            We&apos;ll email you a one-time link. No password needed.
          </p>
        </form>

        <footer className="flex items-center justify-center gap-1.5 border-t border-border-base px-8 py-4">
          <span className="text-[12px] text-fg-muted">
            By continuing you agree to the
          </span>
          <Link
            href="#"
            className="text-[12px] font-medium text-fg-primary hover:underline"
          >
            terms &amp; log policy
          </Link>
        </footer>
      </div>
    </section>
  );
}

function Tabs() {
  return (
    <div className="px-8 pb-4">
      <div className="flex gap-1 rounded-full border border-border-base bg-surface-card-alt p-1">
        <TabButton active>Sign in</TabButton>
        <TabButton>Create account</TabButton>
      </div>
    </div>
  );
}

function TabButton({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex-1 rounded-full px-4 py-2 text-[13px] transition-colors ${
        active
          ? "border border-border-base bg-surface-card font-semibold text-fg-primary"
          : "font-medium text-fg-secondary hover:text-fg-primary"
      }`}
    >
      {children}
    </button>
  );
}

function Aside() {
  const items = [
    {
      h: "Builders & leaders",
      d:
        "Sign in to land in your team dashboard, board, calendar, and daily log.",
    },
    {
      h: "Hirers",
      d:
        "Sign in to manage unlocked logs, NDA copies, and your saved candidates.",
    },
    {
      h: "No invite yet?",
      d:
        "You can still sign in — you'll just see the public feed until a team picks you up.",
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
            <h3 className="text-[13px] font-semibold text-fg-primary">
              {it.h}
            </h3>
            <p className="text-[12px] leading-[1.5] text-fg-secondary">
              {it.d}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* -------------------------- Icons / buttons -------------------------- */

function SocialButton({
  variant,
  children,
}: {
  variant: "google" | "telegram";
  children: ReactNode;
}) {
  if (variant === "google") {
    return (
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2.5 rounded-full border-[1.5px] border-black bg-surface-card px-4 py-3 text-[13px] font-semibold text-fg-primary transition-colors hover:bg-surface-card-alt"
      >
        <GoogleIcon />
        {children}
      </button>
    );
  }
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2.5 rounded-full bg-surface-inverse px-4 py-3 text-[13px] font-semibold text-fg-inverse transition-colors hover:opacity-90"
    >
      <TelegramIcon />
      {children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.5 12.27c0-.79-.07-1.55-.2-2.27H12v4.31h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.22-4.74 3.22-8.12Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.99 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.28-1.93-6.14-4.53H2.2v2.85A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.86 14.11A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.45.36-2.11V7.04H2.2A11 11 0 0 0 1 12c0 1.78.43 3.46 1.2 4.96l3.66-2.85Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.4c1.62 0 3.07.56 4.21 1.65l3.16-3.16C17.45 2.07 14.97 1 12 1 7.7 1 3.99 3.47 2.2 7.04l3.66 2.85C6.72 7.33 9.14 5.4 12 5.4Z"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#29A9EA" aria-hidden>
      <path d="M21.05 3.32 2.82 10.35c-1.12.43-1.1 1.04-.2 1.31l4.68 1.46 10.82-6.83c.51-.3.98-.14.6.2L9.9 14.4h-.01l.01.01-.32 4.82c.42 0 .61-.19.85-.42l2.05-2 4.27 3.15c.79.43 1.35.21 1.55-.73l2.8-13.19c.29-1.15-.44-1.67-1.15-1.32Z" />
    </svg>
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
