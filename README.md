# Temporal One

A platform where unemployed people find each other, form 5-person teams, and ship 30-day projects together. Every day of work goes into a public log — proof, not promises. Hirers pay to read full logs and see who's actually shipping.

Lost your job? You're not alone. Temporal One pairs you with 4 strangers in your situation, runs you through a 30-day sprint with daily logs and peer reviews, and turns the whole month into evidence you can show employers.

## What ships today

Next.js webapp on Railway, backed by Neon Postgres. Real auth via Google + Telegram (Auth.js v5). Builders can sign up, sign in, and persist log entries to the database. The public-facing detail pages and team flow ship in the next cycle.

### Public site

| Route                  | What it is                                                                 |
|------------------------|----------------------------------------------------------------------------|
| `/`                    | Hero + "COHORT #1 not yet started" panel + role CTAs                       |
| `/how-it-works`        | The 4-step path + public/paid breakdown                                    |
| `/for-hirers`          | Hirer landing — pricing, sample log preview, "Talk to us" CTAs             |
| `/signin`              | Google + Telegram buttons. Same flow signs up new users and signs back in existing ones. |

### Builder admin (`/app/*`)

Gated by `middleware.ts` — `/app/*` redirects to `/signin?callbackUrl=...` for unauthenticated users.

| Route             | Screen                                                                      |
|-------------------|-----------------------------------------------------------------------------|
| `/app/today`      | Server-rendered log + add-entry modal (writes to `log_entries` in Postgres) |
| `/app/team`       | Empty state until team flow ships                                           |
| `/app/reviews`    | Empty state until team flow ships                                           |
| `/app/inbox`      | Empty state until team flow ships                                           |
| `/app/playbook`   | Coming-soon with notify-me                                                  |

### Money buttons

Every "Unlock — $500", "Subscribe Pro — $200/mo", and "Notify me" opens an interest-capture modal that posts to `/api/interest` — writes to `interest_submissions` and emails admin. No payment yet — admin gets the lead, replies by hand.

## Tech

| Layer    | Tech                                                                  |
|----------|-----------------------------------------------------------------------|
| Framework| Next.js 16 (Turbopack), React 19, TypeScript                          |
| Styling  | Tailwind CSS v4 (light theme, orange `#FF9800` accent)                |
| Fonts    | Newsreader (display), Inter (sans), Geist Mono                        |
| DB       | Neon Postgres (serverless driver) + Drizzle ORM                       |
| Auth     | Auth.js v5 + DrizzleAdapter, JWT sessions, Google + Telegram          |
| Email    | Nodemailer over SMTP (interest forms)                                 |
| Hosting  | Railway                                                               |
| Designs  | Pencil `.pen` files                                                   |

## Quick start

```bash
npm install --legacy-peer-deps
cp .env.example .env.local      # then fill in values — see docs/development.md
npm run db:push                 # push schema to your Neon database
npm run dev                     # http://localhost:3000
```

Telegram login won't work on `localhost` (the widget refuses to render); test it against the deployed Railway URL. Google works locally if your OAuth client lists `http://localhost:3000/api/auth/callback/google`.

## Deeper reading

For internal docs:

- [`docs/architecture.md`](docs/architecture.md) — stack, routes, DB schema, runtime split
- [`docs/auth.md`](docs/auth.md) — how Google + Telegram actually wire up
- [`docs/development.md`](docs/development.md) — env vars, migrations, Railway, troubleshooting
- [`docs/done.md`](docs/done.md) — what's built and what's deferred

## License

MIT
