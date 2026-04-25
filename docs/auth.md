# Auth

## Sign-in / sign-up

Same flow for both. `/signin` shows two buttons; clicking either creates a user on first use and signs them in on subsequent uses. There is no separate signup form.

### Google (OAuth)

1. User clicks "Continue with Google" → server action calls `signIn("google", { redirectTo: "/app/today" })`.
2. Auth.js redirects to Google → user consents → Google redirects back to `/api/auth/callback/google`.
3. Auth.js' DrizzleAdapter:
   - On first ever sign-in: inserts a row into `users` (id, email, name, image), and a row into `accounts` (provider="google", providerAccountId=Google's sub).
   - On subsequent sign-ins: just looks up the account row.
4. `events.createUser` (in `auth.ts`) fires only on first sign-in. It generates a unique `handle` from the email/name and writes it to `users.handle`.
5. `callbacks.jwt` enriches the JWT with `userId`, `handle`, `role`.
6. `callbacks.session` exposes those fields on `session.user`.
7. Auth.js sets the JWT cookie and redirects to `/app/today`.

Required env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, plus `AUTH_URL` matching the deployed origin so the callback URL resolves.

### Telegram (Login Widget)

This is a custom Credentials provider because Auth.js doesn't ship a Telegram one.

1. `/signin` server-renders `<TelegramLoginButton botUsername={...} />`.
2. The client component injects Telegram's official widget script (`telegram.org/js/telegram-widget.js?22`) with `data-telegram-login=<bot_username>` and `data-onauth="onTelegramAuth(user)"`.
3. The script paints a "Log in with Telegram" button. **It only paints if the bot has the deployed domain registered via `/setdomain` in @BotFather.** No domain → no button.
4. User clicks → Telegram popup → user confirms → widget calls `window.onTelegramAuth(user)` with `{ id, first_name, last_name?, username?, photo_url?, auth_date, hash }`.
5. Our `onTelegramAuth` handler POSTs that payload + the desired `callbackUrl` to `/api/auth/telegram-callback`.
6. The route handler validates with zod, then calls `signIn("telegram", credentials, { redirect: false })`.
7. Auth.js routes that to the Telegram Credentials provider's `authorize()` callback in `auth.ts`. This:
   - Verifies the HMAC: `HMAC-SHA256(data_check_string, SHA256(BOT_TOKEN))`. Only the 6 Telegram fields (`auth_date`, `first_name`, `id`, `last_name`, `photo_url`, `username`) are part of `data_check_string`, sorted alphabetically. **Anything else (csrfToken, callbackUrl) injected by Auth.js into the credentials object is filtered out** — they're not signed by Telegram and would break verification.
   - Rejects payloads older than 24h (`auth_date` check).
   - Looks up `accounts` by (provider="telegram", providerAccountId=tgId). If found, returns the linked user.
   - If not found: inserts a `users` row (name = first+last or username, image = photo_url, handle = generated unique slug from username/name) **and** an `accounts` row, then returns the new user.
8. Auth.js mints a JWT, route handler returns `{ ok: true, redirect }`, client does `router.replace(redirect)`.

Required env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`. The bot must have `/setdomain` set to the deployed host.

## Sessions

JWT, not database. The cookie is `authjs.session-token` (or `__Secure-authjs.session-token` on https). `AUTH_SECRET` encrypts/signs it. The middleware's only job is to decrypt the cookie and check it's present + non-expired; it doesn't touch the DB.

The token carries:
- `userId` — UUID from `users.id`
- `handle` — from `users.handle`
- `role` — `builder | hirer | admin`

These are set in `callbacks.jwt` on first decode after sign-in (one DB query) and cached on the token thereafter. `callbacks.session` mirrors them onto `session.user` for use in server components / route handlers.

## Auth gate

`middleware.ts` matches `/app/:path*`. If `req.auth` is null, redirect to `/signin?callbackUrl=<original>`. Edge runtime, no DB.

Inside `/app/*` server components you can call `auth()` (from `auth.ts`) to get the full session object — that's where you read `session.user.id` to scope DB queries.

## Sign out

Hit `/api/auth/signout` (the BuilderTopNav has a "sign out" link pointing at it). Auth.js clears the cookie and redirects.

## Adding a new provider

- Stateless / OAuth (e.g. GitHub): add to `auth.config.ts`. It'll work in middleware automatically.
- Needs DB or Node-only crypto (e.g. another Credentials flow): add to `auth.ts` only. Middleware won't see it, but that's fine — middleware only checks "is there a valid JWT?", it doesn't care which provider issued it.
