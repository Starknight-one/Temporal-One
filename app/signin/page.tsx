import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";
import { TelegramLoginButton } from "./TelegramLoginButton";

export const metadata: Metadata = {
  title: "Sign in — Temporal One",
};

type Params = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SigninPage({ searchParams }: Params) {
  const { callbackUrl } = await searchParams;
  const target = sanitizeCallback(callbackUrl) ?? "/app/today";

  const session = await auth();
  if (session?.user) redirect(target);

  const botUsername = process.env.TELEGRAM_BOT_USERNAME ?? "";

  async function googleSignIn() {
    "use server";
    await signIn("google", { redirectTo: target });
  }

  return (
    <>
      <LandingHeader current="signin" />
      <main className="bg-surface-primary">
        <section className="mx-auto flex max-w-[1100px] flex-col gap-12 px-6 py-16 sm:px-12 lg:flex-row lg:items-start lg:px-20">
          <div className="flex flex-1 flex-col gap-7">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-fg-muted">
                SIGN IN
              </span>
              <h1 className="font-display text-[44px] font-semibold leading-tight text-fg-primary sm:text-[52px]">
                Welcome back.
              </h1>
              <p className="text-[15px] leading-relaxed text-fg-secondary">
                One-tap sign-in via Google or Telegram. We don&apos;t do
                passwords — your account is keyed by the provider.
              </p>
            </div>

            <div className="flex max-w-[400px] flex-col gap-3">
              <form action={googleSignIn}>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full border-[1.5px] border-black bg-surface-card px-5 py-3.5 text-[14px] font-semibold text-fg-primary hover:bg-surface-card-alt"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </form>

              {botUsername ? (
                <TelegramLoginButton
                  botUsername={botUsername}
                  callbackUrl={target}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-border-base bg-surface-card-alt px-5 py-4 font-mono text-[11px] text-fg-muted">
                  Telegram login is unconfigured (TELEGRAM_BOT_USERNAME not set).
                </div>
              )}

              <p className="font-mono text-[11px] text-fg-muted">
                By signing in you agree to our{" "}
                <Link
                  href="/how-it-works"
                  className="font-semibold text-fg-secondary underline-offset-4 hover:underline"
                >
                  log policy
                </Link>{" "}
                — every entry is permanent and visible to your team.
              </p>
            </div>
          </div>

          <aside className="flex w-full max-w-[380px] flex-col gap-3 rounded-2xl border border-border-base bg-surface-card-alt p-6">
            <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-fg-muted">
              FIRST TIME?
            </span>
            <p className="text-[14px] leading-relaxed text-fg-primary">
              Signing in with Google or Telegram <strong>creates your
              account</strong> on the spot. There&apos;s no separate signup
              step.
            </p>
            <p className="text-[13px] leading-relaxed text-fg-secondary">
              You&apos;ll land on your private dashboard. From there you can
              add log entries straight away — team flow ships next.
            </p>
            <div className="mt-2 border-t border-border-base pt-3 text-[13px] text-fg-secondary">
              Want to be matched with a cohort?{" "}
              <Link
                href="/apply"
                className="font-semibold text-fg-primary underline-offset-4 hover:underline"
              >
                Apply
              </Link>
              .
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}

function sanitizeCallback(value: string | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  return value;
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.46-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.01-2.32Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.46.86 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
