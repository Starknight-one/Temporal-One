# Architecture

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.3 (Turbopack), React 19, TypeScript |
| Styling | Tailwind v4 (light theme, orange `#FF9800` accent) |
| Fonts | Newsreader (display) · Inter (sans) · Geist Mono |
| DB | Neon Postgres (serverless driver) |
| ORM | Drizzle (`drizzle-orm`, `drizzle-kit`) |
| Auth | Auth.js v5 (`next-auth@beta`) + DrizzleAdapter |
| Email | Nodemailer over SMTP (apply/interest only) |
| Hosting | Railway |

## Routes

```
PUBLIC
  /                            Hero + COHORT #1 plashka + role CTAs
  /how-it-works                The 4-step path explainer
  /for-hirers                  Pricing + sample log preview + InterestModal CTAs
  /signin                      Google + Telegram buttons (sign up = sign in)

PROTECTED  (middleware.ts redirects to /signin if no session)
  /app                         → /app/today
  /app/today                   Server component, reads log_entries for current user
  /app/team                    Empty state until team flow ships
  /app/reviews                 Empty state until team flow ships
  /app/inbox                   Empty state until team flow ships
  /app/playbook                "Coming soon" + Notify-me InterestModal

API
  /api/auth/[...nextauth]      Auth.js handler (Google OAuth callback, etc.)
  /api/auth/telegram-callback  Receives the Telegram widget payload, calls signIn("telegram")
  /api/log-entries (POST)      Auth-required, validates with zod, inserts to log_entries
  /api/interest (POST)         Insert to interest_submissions + email admin
```

`/projects/[slug]` and `/u/[handle]` were removed when fixtures got wiped — they'll come back wired to real cohort data.

## Layout

```
app/
  layout.tsx               root html + fonts
  page.tsx                 / (server component)
  globals.css              tokens + animations (live-ping etc.)
  signin/
    page.tsx               server: Google form + redirect-if-session
    TelegramLoginButton.tsx  client: injects telegram widget script + onAuth handler
  api/
    auth/[...nextauth]/route.ts
    auth/telegram-callback/route.ts
    log-entries/route.ts
    interest/route.ts
  how-it-works/, for-hirers/   public marketing pages
  app/                     builder admin segment
    layout.tsx             auth() guard + BuilderTopNav
    page.tsx               redirect to /app/today
    today/page.tsx         server: SELECT log_entries WHERE user_id = session.user.id
    team/, reviews/, inbox/, playbook/   empty/stub pages

components/
  LandingHeader.tsx        public-site nav
  Footer.tsx
  InterestModal.tsx        <InterestButton>, posts to /api/interest
  admin/
    BuilderTopNav.tsx      sticky nav with avatar + sign-out
    AddLogEntryModal.tsx   client modal, fetch → /api/log-entries → router.refresh()
    shared.tsx             TypePill, ArtifactPreview, Avatar
lib/
  db/
    client.ts              drizzle(neon(DATABASE_URL))
    schema.ts              all tables + enums
  email.ts                 SMTP send + html envelope
  github.ts                parseGithubPrUrl helper
  rate-limit.ts            in-process IP bucket
  types.ts                 shared UI types (EntryType, ArtifactKind)

auth.ts                    full Auth.js config (route handlers, has DB + Telegram)
auth.config.ts             Edge-safe config (middleware uses this)
middleware.ts              JWT-only auth gate for /app/*
drizzle.config.ts          drizzle-kit config
.npmrc                     legacy-peer-deps=true (next-auth@beta wants nodemailer 7)
```

## DB schema

All defined in `lib/db/schema.ts`. Live in Neon — push with `npm run db:push`.

| Table | What it's for |
|---|---|
| `users` | One row per signed-in builder. Fields: id, name, email, image, **handle** (auto-generated unique slug), **role** ("builder"/"hirer"/"admin"), createdAt |
| `accounts` | Auth.js OAuth links. One row per provider (google, telegram) per user. Composite PK = (provider, providerAccountId) |
| `sessions` | Defined for future use; currently empty (we use JWT sessions) |
| `verification_tokens` | DrizzleAdapter expects the table; not used by our flows |
| `log_entries` | Builder's daily entries: title, type (built/fixed/researched/designed/shipped/blocked), time_spent, artifact_url + auto-detected GitHub PR meta, posted_at, locked_at (= +1h) |
| `applications` | (Form `/api/apply` was removed — table kept for the future return of the funnel) |
| `interest_submissions` | "Notify me" / "Unlock $500" / "Pro $200/mo" form captures from /for-hirers and /app/playbook |
| `teams`, `team_members`, `reviews`, `inbox_items` | Defined now, **unused** until team flow ships in the next cycle |

Sessions are JWT (not database), so `sessions` table sits empty — Auth.js v5 + Edge middleware can't query Postgres, so DB-backed sessions caused JWE decode errors. Accounts and users are still written to DB on first sign-in via the DrizzleAdapter.

## Runtime split — important

Auth.js v5 has two configs because middleware runs on the Edge runtime, which can't load `node:crypto` or open a Postgres connection:

- `auth.config.ts` — Google provider only, JWT session strategy, no adapter. Imported by `middleware.ts` and by `auth.ts`.
- `auth.ts` — extends `authConfig` and adds `DrizzleAdapter`, the **Telegram Credentials provider** (uses `node:crypto` for HMAC), the `jwt`/`session` callbacks (which query DB), and the `createUser` event (writes the auto-generated handle). Used by route handlers and server components.

If you add a new provider that needs DB access or `node:crypto`, put it in `auth.ts`, not `auth.config.ts`.
