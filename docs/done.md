# Done / Not done

Snapshot at end of the DB+auth migration.

## Done

### Public site
- Hero + COHORT-#1-not-yet-started panel on `/`.
- `/how-it-works` — 4-step path + public/paid breakdown.
- `/for-hirers` — pricing card, sample-log preview, "Notify me" / "Talk to us" via InterestModal.
- LandingHeader nav: Feed / How / For hirers / Sign in.
- Footer: brand line + `mailto:starknight@keepstar.one`.
- All paid CTAs ("Unlock $500", "Pro $200/mo") open the email-capture InterestModal — no payment integration.

### Auth
- Auth.js v5 wired up.
- Google OAuth working end-to-end.
- Telegram Login Widget working end-to-end (HMAC verify, user/account upsert on first sign-in).
- `/signin` is a single page that does both signup and sign-in (same buttons).
- Magic-link flow deleted.
- `middleware.ts` gates `/app/*` (302 to `/signin?callbackUrl=...` if no JWT).
- Auto-generated `handle` slug on user creation.

### DB
- Neon Postgres provisioned.
- Drizzle schema + client.
- 11 tables pushed: `users`, `accounts`, `sessions`, `verification_tokens`, `log_entries`, `applications`, `interest_submissions`, `teams`, `team_members`, `reviews`, `inbox_items`.
- All fixtures wiped.

### Builder admin (`/app/*`)
- `/app/today` — server component, real entries from `log_entries` for the signed-in user; `+ Add log entry` modal posts to `/api/log-entries`, persists, `router.refresh()` repaints. Stats row (entries / total time / today / warnings) computed from real data.
- `/app/team`, `/app/reviews`, `/app/inbox` — empty-state placeholders ("Team flow ships next").
- `/app/playbook` — coming-soon with Notify-me InterestModal.
- BuilderTopNav with avatar + sign-out link.

### API
- `/api/auth/[...nextauth]` — Auth.js handler.
- `/api/auth/telegram-callback` — receives widget payload, calls `signIn("telegram")`.
- `/api/log-entries` (POST) — auth-required, zod-validated, writes to `log_entries`.
- `/api/interest` (POST) — writes to `interest_submissions` + emails admin.

### Ops
- Deployed to Railway. Env vars set: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `AUTH_TRUST_HOST`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, plus existing `SMTP_*` and `APPLY_TO_EMAIL`.
- @BotFather `/setdomain` set to `temporal-one-production.up.railway.app`.
- Google OAuth redirect URI registered.
- `.npmrc` with `legacy-peer-deps=true` so Railway's `npm ci` doesn't fail on `next-auth@beta` ↔ `nodemailer@8`.

## Not done (deferred)

### Team flow
The big missing piece. Tables (`teams`, `team_members`) exist but nothing reads them. When this lands:
- Onboarding: "create or join a team" or auto-match into cohort.
- `/app/team` — real teammates feed.
- `/app/reviews` — real per-teammate review queue.
- `/app/inbox` — real notifications (review reminders, day-closed, peer feedback).
- TopNav badges (`reviews`, `inbox` counts) wire to real data.

### Public detail pages
`/projects/[slug]` and `/u/[handle]` were removed when fixtures got wiped. They need to come back as dynamic server components reading from `teams`/`team_members`/`log_entries` once a real cohort exists. Same for the public feed at `/` — currently it's a "no cohorts yet" empty state.

### Payments
None. All "$500 unlock" / "$200/mo Pro" buttons collect emails and the admin replies by hand.

### Apply funnel
`/apply` and `/api/apply` are gone. Right now Google/Telegram = signup. If we want a separate "apply for cohort" funnel later (filtering for fit), we'll add it back.

### Log entry editing
`log_entries.locked_at` is set to `created_at + 1h` but there's no UI for editing within that window. Entries are write-only.

### Notifications
`inbox_items` table exists; nothing populates it.

### Profile editing
The `handle` is auto-generated and not editable from UI. `users.role` only ever set to `builder`.

### Apply / Interest persistence
`/api/interest` writes to DB **and** emails. `/api/apply` is gone. `applications` table is unused — kept around for when we restore a real apply funnel.

### Migrations workflow
Currently using `drizzle-kit push` (no versioned migrations). Once prod has real data, switch to `db:generate` + checked-in SQL files.
