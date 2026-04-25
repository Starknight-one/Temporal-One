# Temporal One

A platform where unemployed people find each other, form 5-person teams, and ship 30-day projects together. Every day of work goes into a public log — proof, not promises. Hirers pay to read full logs and see who's actually shipping.

Lost your job? You're not alone. Temporal One pairs you with 4 strangers in your situation, runs you through a 30-day sprint with daily logs and peer reviews, and turns the whole month into evidence you can show employers.

## What ships today

This repo is a **Next.js webapp**. There's no real backend yet — all data is static fixtures, all forms email `starknight@keepstar.one` via SMTP. The site exists to validate the concept and capture interest.

### Public site

| Route                  | What it is                                                                 |
|------------------------|----------------------------------------------------------------------------|
| `/`                    | Feed — featured projects, live activity log with streaming new entries     |
| `/projects/[slug]`     | Project detail — team, stats, paywalled activity log                       |
| `/u/[handle]`          | Builder detail — bio, stats, paywalled activity log                        |
| `/for-hirers`          | Hirer landing — pricing, sample log preview, intro-call CTA                |
| `/how-it-works`        | The 4-step path + public/paid breakdown                                    |
| `/apply`               | Single form, build/hire toggle, honeypot, rate-limited                     |
| `/signin`              | Honest magic-link request — admin replies within 24h                       |
| `/dashboard`           | Placeholder until cohort #1                                                |

### Builder admin (`/app/*`)

Authenticated-builder area shipped as a static mockup (no auth gate yet). Designed in Pencil, mirrors what a builder sees during their 30-day sprint.

| Route             | Screen                                                                      |
|-------------------|-----------------------------------------------------------------------------|
| `/app/today`      | Today + My Log — stats, add-entry CTA, today's entries, previous days       |
| `/app/team`       | Team Feed — sidebar with teammates, lateral feed of their day               |
| `/app/playbook`   | Playbook — coming-soon empty state with notify CTA                          |
| `/app/reviews`    | Reviews (Quick) — anonymous peer reviews with completion progress           |
| `/app/inbox`      | Inbox — warnings, feedback, day-closed notifications                        |

### Money buttons

Every "Unlock — $500", "Subscribe Pro — $200/mo", and "Notify me" opens an interest-capture modal that posts to `/api/interest`. No payment yet — admin gets an email, replies by hand.

## Tech

| Layer    | Tech                                                |
|----------|-----------------------------------------------------|
| Framework| Next.js 16 (Turbopack), React 19, TypeScript        |
| Styling  | Tailwind CSS v4 (light theme, orange accent)        |
| Fonts    | Newsreader (display), Inter (sans), Geist Mono      |
| Email    | Nodemailer over SMTP                                |
| Hosting  | Railway                                             |
| Designs  | Pencil `.pen` files (live in `~/Downloads/new.pen`) |

### Layout

```
app/
  page.tsx                 # /  feed homepage (client component)
  layout.tsx               # root html + fonts
  globals.css              # tokens + animations (featured-glow, log-drop-in, live-ping)
  api/
    apply/route.ts         # /apply submissions → SMTP
    interest/route.ts      # interest-modal submissions → SMTP
    auth/magic-link/       # /signin magic-link request → SMTP
  projects/[slug]/         # SSG over PROJECTS
  u/[handle]/              # SSG over BUILDERS
  app/                     # builder admin shell + 5 screens
  for-hirers/, how-it-works/, apply/, signin/, dashboard/, cohort/

components/
  LandingHeader.tsx        # public-site pill nav
  Footer.tsx
  InterestModal.tsx        # <InterestButton> client component used everywhere money is mentioned
  SubpageHeader.tsx        # alias for LandingHeader

lib/
  data.ts                  # PROJECTS, BUILDERS, log fixtures
  admin-data.ts            # cohort fixtures for /app/*
  email.ts                 # validators, escapeHtml, SMTP helpers
  rate-limit.ts            # in-process IP buckets (5 / 10min default)
```

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

### Environment variables

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=postmaster@example.com
SMTP_PASSWORD=...
APPLY_TO_EMAIL=starknight@keepstar.one
```

In dev without SMTP set, mail submissions log to the console and the success state still shows.

### Deploy

```bash
railway up --detach
```

Railway uses the standard Next.js build/start. Env vars are configured in the Railway project.

## License

MIT
