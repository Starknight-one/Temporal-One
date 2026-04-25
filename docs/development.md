# Development

## Env vars

Copy `.env.example` to `.env.local` and fill in. **Required** locally:

```
DATABASE_URL=postgresql://neondb_owner:...@...neon.tech/neondb?sslmode=require&channel_binding=require
AUTH_SECRET=<openssl rand -base64 32>
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_BOT_USERNAME=temporal_one_bot
```

`SMTP_*` and `APPLY_TO_EMAIL` only needed if you're testing the InterestModal email flow. In dev without SMTP set, sends log to console and the success state still shows.

## Local dev

```bash
npm install --legacy-peer-deps   # only first time (matches .npmrc)
npm run dev                       # http://localhost:3000
```

For Google OAuth to work locally, the OAuth client in Google Cloud Console must list `http://localhost:3000/api/auth/callback/google` in its authorized redirect URIs.

For Telegram to work locally — it doesn't. The Telegram Login Widget refuses to paint a button on `localhost`. Test Telegram only against the deployed Railway URL.

## DB migrations (Drizzle)

Schema lives in `lib/db/schema.ts`. To apply schema changes to Neon:

```bash
npm run db:push        # picks up DATABASE_URL from .env.local, applies diff
```

`db:push` is **destructive-friendly** — drizzle-kit will warn about column drops/renames in interactive mode, but in our config (`strict: false`, `--force` in CI) it auto-approves. Be careful with renames; do them in two steps if you care about prod data.

For proper versioned migrations later (when prod has real data):

```bash
npm run db:generate    # writes a SQL migration file to lib/db/migrations/
# commit the SQL, run it on prod via a job or via drizzle-kit migrate
```

We're not generating migration files yet because the schema is still settling and prod has no business data.

```bash
npm run db:studio      # browse the DB at https://local.drizzle.studio
```

## Build

```bash
npm run build          # next build with Turbopack
```

Build needs `DATABASE_URL` (Drizzle module-level throws otherwise) and `AUTH_SECRET`. For a smoke build with placeholders:

```bash
DATABASE_URL=postgresql://placeholder@x/y?sslmode=require AUTH_SECRET=local AUTH_URL=http://localhost npm run build
```

## Railway deploy

Service is linked. Push code via:

```bash
railway up --detach
```

This uploads the current local directory (respecting `.gitignore` + `.railwayignore`) and triggers a fresh build on Railway's runners.

Railway env vars (production) can be inspected with:

```bash
railway variables                          # human-readable
railway variables -k                       # KEY=value (machine-readable)
```

To set / update:

```bash
railway variables --set 'KEY=value' --skip-deploys
```

`--skip-deploys` prevents auto-redeploying after each var change — set them all then `railway up`.

## Important runtime/build notes

- **`.npmrc`** has `legacy-peer-deps=true`. `next-auth@beta` peer-wants `nodemailer@^7`, we're on `8`. Don't remove the .npmrc unless you also bump nodemailer down.
- **`middleware.ts`** runs on the Edge runtime. It MUST NOT import anything that pulls in `node:crypto`, the Postgres driver, or the DrizzleAdapter. That's why the Auth.js config is split (`auth.config.ts` is Edge-safe; `auth.ts` is full Node).
- **Sessions are JWT.** Don't switch to `strategy: "database"` in `auth.config.ts` — middleware will 500 on every `/app/*` request because Edge can't open a DB connection to look up the session.
- **`/api/log-entries`** rate-limits per `(user_id, ip)`: 30 entries per 10 minutes. Bucket lives in-process and resets on deploy.
- **Drizzle config** loads `.env.local` then `.env` via `dotenv` — see `drizzle.config.ts`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Telegram button doesn't appear on `/signin` | `/setdomain` not set in @BotFather, or `TELEGRAM_BOT_USERNAME` env missing. |
| Telegram click → "auth_failed" / "hash mismatch" | Check Railway runtime logs — there's a debug line printing the dataCheckString and computed vs received hash. Usually one of: TG_HASH_FIELDS is missing a field Telegram added; bot token mismatch between local and Railway. |
| `/app/today` returns 500 | Likely middleware crash — check runtime logs for `JWTSessionError` / `JWE`. Probably session strategy was switched to database. |
| Build fails with peer dep error | `.npmrc` was deleted or `package-lock.json` regenerated without `--legacy-peer-deps`. |
| Google OAuth: `redirect_uri_mismatch` | Authorized redirect URI in Google Cloud Console doesn't match `AUTH_URL/api/auth/callback/google`. |
