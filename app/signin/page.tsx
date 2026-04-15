import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in — Temporal One",
  description: "Sign in to your Temporal One team dashboard.",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full bg-surface-primary">
      {/* Left half */}
      <div className="relative hidden flex-1 overflow-hidden bg-surface-card-alt lg:block">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.8), rgba(10,10,10,0.6) 50%, rgba(10,10,10,0))",
          }}
        />
        <h2
          className="absolute bottom-16 left-16 font-display text-[96px] uppercase leading-[0.9] text-fg-primary"
          style={{ letterSpacing: "-0.01em" }}
        >
          Stop
          <br />
          waiting.
          <br />
          Start
          <br />
          shipping.
        </h2>
      </div>

      {/* Right half */}
      <div className="flex w-full flex-col justify-center gap-6 bg-surface-primary px-8 py-10 sm:px-12 lg:w-[520px] lg:shrink-0">
        <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-fg-secondary">
          Temporal One
        </span>

        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold text-fg-primary">
            Welcome back.
          </h1>
          <p className="text-[15px] text-fg-secondary">
            Sign in to your team dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SocialButton label="Continue with Google" variant="google" />
          <SocialButton label="Continue with Telegram" variant="telegram" />
        </div>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border-base" />
          <span className="text-[13px] text-fg-secondary">or</span>
          <div className="h-px flex-1 bg-border-base" />
        </div>

        <form
          className="flex flex-col gap-4"
          action="/dashboard/board"
          method="get"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[13px] font-medium text-fg-secondary"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="h-12 rounded-sm border border-border-base bg-surface-card px-4 text-sm text-fg-primary outline-none placeholder:text-[#555] focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[13px] font-medium text-fg-secondary"
              >
                Password
              </label>
              <Link
                href="#"
                className="text-[13px] text-accent hover:text-accent-hover"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="h-12 rounded-sm border border-border-base bg-surface-card px-4 text-base text-fg-primary outline-none placeholder:text-[#555] focus:border-accent"
            />
          </div>

          <button
            type="submit"
            className="mt-1 inline-flex h-12 items-center justify-center rounded-sm bg-accent text-[15px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover"
          >
            Sign in
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[13px]">
          <span className="text-fg-secondary">Don&apos;t have access yet?</span>
          <Link
            href="/apply"
            className="font-medium text-accent hover:text-accent-hover"
          >
            Join the waitlist
          </Link>
        </div>
      </div>
    </div>
  );
}

function SocialButton({
  label,
  variant,
}: {
  label: string;
  variant: "google" | "telegram";
}) {
  const iconColor = variant === "telegram" ? "#29A9EA" : "#FFFFFF";
  return (
    <button
      type="button"
      className="inline-flex h-12 items-center justify-center gap-2.5 rounded-sm border border-border-base bg-surface-card text-sm font-medium text-fg-primary transition-colors hover:border-fg-secondary"
    >
      {variant === "google" ? (
        <GoogleIcon color={iconColor} />
      ) : (
        <TelegramIcon color={iconColor} />
      )}
      <span>{label}</span>
    </button>
  );
}

function GoogleIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" y1="8" x2="12" y2="8" />
      <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
      <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
    </svg>
  );
}

function TelegramIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden
    >
      <path d="M21.05 3.32 2.82 10.35c-1.12.43-1.1 1.04-.2 1.31l4.68 1.46 10.82-6.83c.51-.3.98-.14.6.2L9.9 14.4h-.01l.01.01-.32 4.82c.42 0 .61-.19.85-.42l2.05-2 4.27 3.15c.79.43 1.35.21 1.55-.73l2.8-13.19c.29-1.15-.44-1.67-1.15-1.32Z" />
    </svg>
  );
}
