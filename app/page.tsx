import type { ReactNode } from "react";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";

const CTA_HREF = "/apply";

export default function Home() {
  return (
    <>
      <LandingHeader />
      <main className="bg-surface-primary text-fg-primary">
        <Hero />
        <Problem />
        <Idea />
        <HowItWorks />
        <WhatYouGet />
        <RealTalk />
        <SocialProof />
        <FinalCTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

/* -------------------------- Hero -------------------------- */

function Hero() {
  return (
    <section
      className="relative flex min-h-[900px] flex-col items-center justify-end overflow-hidden px-6 pb-20 pt-32 sm:px-12 md:px-20 md:pt-40 md:pb-20"
      style={{
        background:
          "radial-gradient(140% 120% at 50% 30%, #1A1A2E 0%, #0A0A0A 70%), linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.8) 40%, #0A0A0A 85%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-primary/80 to-surface-primary" />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-8 text-center">
        <h1 className="font-display text-6xl uppercase leading-[0.95] sm:text-7xl md:text-8xl lg:text-[112px]">
          Stop applying.
          <br />
          Start building.
        </h1>

        <p className="max-w-2xl text-base leading-[1.6] text-fg-secondary sm:text-lg">
          You didn&apos;t spend years mastering your craft to refresh LinkedIn
          40 times a day. While you wait for permission to work, your skills
          rust and your confidence erodes. Temporal One puts you back in the
          seat — building real products with real teams, starting now.
        </p>

        <div className="mt-6 flex flex-col items-center gap-5">
          <PrimaryButton href={CTA_HREF}>
            Join the next cohort — $20/mo
          </PrimaryButton>
          <p className="max-w-md text-center font-mono text-xs leading-[1.7] text-fg-secondary">
            Limited to 15 spots. Every team gets a real leader.
            <br />
            Not a webinar. Not a community. A job you give yourself.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Problem -------------------------- */

function Problem() {
  return (
    <section className="bg-surface-primary px-6 py-24 sm:px-12 md:px-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="h-px w-full bg-border-base" />
        <SectionLabel className="mt-20">01 — The Problem</SectionLabel>
        <h2 className="mt-8 font-display text-5xl uppercase leading-[0.95] sm:text-6xl md:text-7xl lg:text-[72px]">
          The job market
          <br />
          isn&apos;t coming
          <br />
          to save you.
        </h2>

        <div className="mt-20 grid gap-10 md:grid-cols-3">
          <p className="text-[15px] leading-[1.75] text-fg-secondary">
            Since 2022, over 500,000 tech professionals have been laid off. The
            industry that promised stability delivered pink slips and
            platitudes. You were told to upskill, network harder, optimize your
            resume with AI. None of it worked because the system isn&apos;t
            broken — it&apos;s indifferent.
          </p>
          <p className="text-[15px] leading-[1.75] text-fg-secondary">
            Every month you spend outside a team, your skills atrophy. The
            frameworks move on. The conversations move on. You become a résumé
            ghost — technically qualified, practically invisible. The gap on
            your CV grows from a line item into a narrative.
          </p>
          <p className="text-[15px] leading-[1.75] text-fg-secondary">
            You don&apos;t need another course. You don&apos;t need another
            networking event where everyone is selling and nobody is buying.
            You need to build something real with people who are serious. You
            need a reason to open your laptop that isn&apos;t another job
            application.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Idea -------------------------- */

function Idea() {
  return (
    <section className="bg-surface-primary px-6 py-24 sm:px-12 md:px-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel>The Idea</SectionLabel>
        <h2 className="mt-16 font-display text-5xl uppercase leading-[0.95] sm:text-6xl md:text-7xl lg:text-[80px]">
          What if unemployment was your unfair advantage?
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-20">
          <p className="text-lg leading-[1.6] text-fg-secondary">
            Right now, thousands of skilled developers, designers, and product
            managers are sitting idle. Not because they lack talent — because
            the market locked them out. Temporal One puts you in a team of 4–5
            with a validated idea and a team lead. You get a 6-week sprint to
            build something real.
          </p>
          <p className="text-lg leading-[1.6] text-fg-secondary">
            We match you based on complementary skills. Every team gets a
            clear brief, weekly milestones, and access to mentors who&apos;ve
            shipped before. No busywork, no filler curriculum — just focused
            building with people who are as hungry as you are.
          </p>
        </div>

        <p className="mt-12 text-2xl italic leading-[1.4] text-fg-primary">
          Not a course. Not a hackathon. A real build with real deadlines and
          real accountability.
        </p>
      </div>
    </section>
  );
}

/* -------------------------- How It Works -------------------------- */

const TIMELINE: { week: string; num: string; title: string; body: string }[] = [
  {
    week: "Week 1",
    num: "01",
    title: "Team Matching + Idea Validation",
    body: "Get matched with 3–4 others based on complementary skills. Your team receives a validated product brief and meets your team lead.",
  },
  {
    week: "Weeks 2–4",
    num: "02",
    title: "Build the MVP",
    body: "Three weeks of focused building. Weekly milestones, async standups, and mentor check-ins keep momentum high. Ship features, not slides.",
  },
  {
    week: "Week 5",
    num: "03",
    title: "Launch",
    body: "Put it in front of real users. Collect feedback, fix critical bugs, and prepare your pitch. This is where the work becomes a product.",
  },
  {
    week: "Week 6",
    num: "04",
    title: "Demo Day",
    body: "Present to mentors, investors, and the community. Walk away with a launched product, a portfolio piece, and connections that matter.",
  },
];

function HowItWorks() {
  return (
    <section className="bg-surface-card px-6 py-24 sm:px-12 md:px-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="mt-16 font-display text-5xl uppercase leading-[0.95] sm:text-6xl md:text-7xl lg:text-[80px]">
          From zero to launched in 6 weeks.
        </h2>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map((t) => (
            <div
              key={t.num}
              className="flex flex-col gap-5 border border-border-base bg-surface-primary p-8"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                {t.week}
              </span>
              <span className="font-display text-5xl leading-none">
                {t.num}
              </span>
              <h3 className="text-lg font-semibold text-fg-primary">
                {t.title}
              </h3>
              <p className="text-sm leading-[1.6] text-fg-secondary">
                {t.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------- What You Get -------------------------- */

const BENEFITS = [
  "A curated team of 4–5 matched by complementary skills",
  "A validated product idea — no time wasted on 'what to build'",
  "A team lead who's shipped before and keeps you on track",
  "A 6-week framework with weekly milestones and async standups",
  "Access to mentors and investors on demo day",
  "A launched product for your portfolio that proves you can ship",
  "The potential co-founders for your next startup",
];

function WhatYouGet() {
  return (
    <section className="bg-surface-primary px-6 py-24 sm:px-12 md:px-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel>What you get</SectionLabel>
        <h2 className="mt-16 font-display text-5xl uppercase leading-[0.95] sm:text-6xl md:text-7xl lg:text-[80px]">
          $20/mo. Here&apos;s what that buys you.
        </h2>

        <ul className="mt-20 flex flex-col">
          {BENEFITS.map((b, i) => (
            <li
              key={i}
              className={`flex items-center gap-6 border-t border-border-base py-6 ${
                i === BENEFITS.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="text-xl text-accent">→</span>
              <span className="text-lg text-fg-primary">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------- Real Talk -------------------------- */

function RealTalk() {
  return (
    <section className="bg-surface-primary px-6 py-24 sm:px-12 md:px-20 md:py-32">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-16 text-center">
        <div className="flex flex-col items-center gap-8">
          <SectionLabel>The real talk</SectionLabel>
          <h2 className="font-display text-5xl uppercase leading-[0.95] sm:text-6xl md:text-7xl lg:text-[80px]">
            Let&apos;s be honest
            <br />
            about what this is.
          </h2>
          <p className="max-w-3xl text-base leading-[1.7] text-fg-secondary sm:text-lg">
            This is not a guaranteed path to a job offer. It&apos;s not a
            bootcamp, an incubator, or a networking club. It&apos;s a
            structured environment where unemployed tech professionals spend
            15–20 hours a week building something real — with a small team, a
            clear deadline, and no bullshit.
          </p>
        </div>

        <div className="grid w-full gap-8 text-left md:grid-cols-2 md:gap-16">
          <CaseCard
            label="Worst case"
            labelClassName="text-fg-secondary"
            title="You built something real."
            body="You spent six weeks shipping a product instead of doom-scrolling LinkedIn. You have a portfolio piece, new skills, and proof that you can execute under pressure. That's infinitely better than a gap on your resume."
          />
          <CaseCard
            label="Best case"
            labelClassName="text-accent"
            title="You launched something people want."
            body="Your sprint team builds a product that gets real users. You find co-founders. You generate revenue. You walk into your next interview with leverage instead of desperation. It happens more often than you'd think."
          />
        </div>
      </div>
    </section>
  );
}

function CaseCard({
  label,
  labelClassName,
  title,
  body,
}: {
  label: string;
  labelClassName: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-sm bg-surface-card-alt p-10">
      <span
        className={`font-mono text-[11px] uppercase tracking-[0.25em] ${labelClassName}`}
      >
        {label}
      </span>
      <h3 className="font-display text-3xl leading-[1.1]">{title}</h3>
      <p className="text-[15px] leading-[1.7] text-fg-secondary">{body}</p>
    </div>
  );
}

/* -------------------------- Social Proof -------------------------- */

function SocialProof() {
  return (
    <section className="bg-surface-card-alt px-6 py-24 sm:px-12 md:px-20 md:py-32">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
        <SectionLabel>Credibility</SectionLabel>
        <h2 className="font-display text-5xl uppercase leading-[0.95] sm:text-6xl md:text-7xl lg:text-[80px]">
          Built by someone
          <br />
          in the same boat.
        </h2>
        <p className="max-w-3xl text-base leading-[1.7] text-fg-secondary sm:text-lg">
          This program is run by a solo founder who&apos;s been through the
          same cycle — layoffs, rejections, the slow erosion of confidence
          that comes from sitting still. Temporal One exists because building
          is the antidote.
        </p>
        <div className="my-6 h-0.5 w-20 bg-border-base" />
        <blockquote className="max-w-2xl text-xl italic leading-[1.6] text-fg-primary sm:text-[22px]">
          &ldquo;This isn&apos;t a community of 10,000 people posting
          motivational quotes. It&apos;s a small, intense, builder-first
          environment.&rdquo;
        </blockquote>
        <p className="max-w-lg text-sm leading-[1.7] text-fg-secondary">
          Spots are limited because every team gets a dedicated lead.
          <br />
          This isn&apos;t scale. This is craft.
        </p>
      </div>
    </section>
  );
}

/* -------------------------- Final CTA -------------------------- */

function FinalCTA() {
  return (
    <section
      id="apply-cta"
      className="bg-surface-primary px-6 py-32 sm:px-12 md:px-20 md:py-40"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 text-center">
        <h2 className="font-display text-5xl uppercase leading-[0.92] sm:text-6xl md:text-8xl lg:text-[100px]">
          Your skills have
          <br />
          an expiration date.
          <br />
          Use them.
        </h2>
        <p className="max-w-xl text-lg leading-[1.6] text-fg-secondary sm:text-xl">
          The next cohort starts soon. 15 spots. $20/mo.
          <br />
          No contracts, cancel anytime.
        </p>

        <PrimaryButton href={CTA_HREF} large>
          Claim your spot
        </PrimaryButton>

        <p className="max-w-lg text-sm leading-[1.7] text-fg-secondary">
          Takes 2 minutes. You&apos;ll fill in your skills, experience, and
          availability — and we&apos;ll match you with a team within a week.
        </p>
      </div>
    </section>
  );
}

/* -------------------------- FAQ -------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "What if I don't have a startup idea?",
    a: "Good. Most people don't. We have a curated bank of validated problems. You pick one that matches your skills and interests. Or if you do have an idea — bring it. We'll help you validate it in week 1.",
  },
  {
    q: "Who are the other people on my team?",
    a: "Verified professionals with real work experience. Engineers, designers, PMs, marketers — people who shipped products at actual companies. We verify backgrounds through LinkedIn. No beginners.",
  },
  {
    q: "What if I get a job offer mid-sprint?",
    a: "Congrats, that's the goal too. Take it. Your team adapts. No hard feelings, no penalties. Some people stay and do both — the sprint is 15–20 hours/week, not a full-time commitment.",
  },
  {
    q: "What does the team lead do?",
    a: "They run standups, set sprint goals, review progress, and make sure nobody disappears. Think of them as a part-time PM for your team. They've built products before and know how to ship.",
  },
  {
    q: "Is this an incubator?",
    a: "No. Incubators want equity. We want $20/mo. If your project takes off, it's 100% yours and your team's. We just gave you the structure to get there.",
  },
  {
    q: "What happens after 6 weeks?",
    a: "If the project has legs — keep building. Form a real company. We'll connect you with investors at demo day. If it doesn't work out — join another team, try another idea, or take your upgraded resume and network to the job market.",
  },
  {
    q: "Why $20?",
    a: "Because free doesn't work. Free means no commitment. $20 is enough to filter out people who aren't serious, and low enough that anyone can afford it — even while unemployed. It's the price of giving a damn.",
  },
];

function FAQ() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 bg-surface-primary px-6 py-24 sm:px-12 md:px-20 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-display text-5xl uppercase leading-[0.95] sm:text-6xl md:text-7xl">
            Questions? Answers.
          </h2>
        </div>

        <dl className="mt-20 flex flex-col">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className={`flex flex-col gap-4 border-t border-border-base py-8 ${
                i === FAQS.length - 1 ? "border-b" : ""
              }`}
            >
              <dt className="text-xl font-semibold text-fg-primary">{f.q}</dt>
              <dd className="text-base leading-[1.6] text-fg-secondary">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* -------------------------- Shared -------------------------- */

function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-[11px] uppercase tracking-[0.35em] text-fg-secondary ${className}`}
    >
      {children}
    </span>
  );
}

function PrimaryButton({
  children,
  href,
  large = false,
}: {
  children: ReactNode;
  href: string;
  large?: boolean;
}) {
  const padding = large ? "px-14 py-5 text-lg" : "px-10 py-4 text-base";
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-sm bg-accent font-semibold text-fg-inverse transition-colors hover:bg-accent-hover ${padding}`}
    >
      {children}
    </a>
  );
}
