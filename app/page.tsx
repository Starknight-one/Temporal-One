import Link from "next/link";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <LandingHeader current="feed" />
      <main className="bg-surface-primary">
        <section className="flex flex-col items-center gap-8 px-6 pb-24 pt-20 sm:px-12 md:px-20">
          <h1 className="text-center font-sans text-5xl font-bold leading-[1.05] tracking-[-0.035em] text-fg-primary sm:text-6xl md:text-[84px]">
            Can&apos;t find work?
            <br />
            Just create it.
          </h1>

          <p className="max-w-[640px] text-center text-[15px] leading-relaxed text-fg-secondary sm:text-base">
            Five strangers, thirty days, one shipped product. Every day of work
            goes into a public log — proof, not promises. Sign in with Google
            or Telegram and you&apos;re a builder.
          </p>

          <Link
            href="/signin"
            className="inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-4 text-[15px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover"
          >
            Sign up · sign in →
          </Link>

          <p className="max-w-[420px] text-center font-mono text-[11px] text-fg-muted">
            Continue with Google or Telegram. We create your account on the
            spot — no separate signup, no password.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
