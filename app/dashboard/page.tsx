import type { Metadata } from "next";
import Link from "next/link";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dashboard — Temporal One",
};

export default function DashboardPlaceholder() {
  return (
    <>
      <LandingHeader />
      <main className="bg-surface-primary">
        <section className="flex flex-col items-center gap-5 px-6 pt-24 pb-32 text-center sm:px-12 md:px-20">
          <span className="font-mono text-[11px] tracking-[0.35em] text-fg-muted">
            COMING SOON
          </span>
          <h1 className="max-w-[720px] font-display text-4xl font-semibold leading-[1.1] tracking-[-0.01em] text-fg-primary sm:text-5xl">
            The team dashboard ships with the first cohort.
          </h1>
          <p className="max-w-[560px] text-[15px] leading-[1.5] text-fg-secondary">
            Daily log, kanban, calendar, peer scoring — built once a real team
            is using it. For now, the public feed is where the action is.
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-surface-inverse px-5 py-3 text-[14px] font-semibold text-fg-inverse hover:opacity-90"
            >
              Back to the feed
            </Link>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-surface-card px-5 py-3 text-[14px] font-semibold text-fg-primary hover:bg-surface-card-alt"
            >
              Apply to the next cohort
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
