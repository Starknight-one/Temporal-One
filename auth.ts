import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { authConfig } from "./auth.config";
import { db } from "@/lib/db/client";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";

const TELEGRAM_AUTH_MAX_AGE = 60 * 60 * 24; // 24h

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    ...authConfig.providers,
    Credentials({
      id: "telegram",
      name: "Telegram",
      credentials: {
        id: { label: "Telegram ID" },
        first_name: { label: "First name" },
        last_name: { label: "Last name" },
        username: { label: "Username" },
        photo_url: { label: "Photo URL" },
        auth_date: { label: "Auth date" },
        hash: { label: "Hash" },
      },
      async authorize(raw) {
        const payload = raw as Record<string, string | undefined>;
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) {
          console.error("TELEGRAM_BOT_TOKEN is not set");
          return null;
        }
        console.log(
          "[telegram] authorize payload keys:",
          Object.keys(payload).join(","),
        );
        if (!verifyTelegramHash(payload, token)) {
          console.warn(
            "[telegram] hash mismatch · received hash=" +
              (payload.hash ?? "null") +
              " · keys=" +
              Object.keys(payload).join(","),
          );
          return null;
        }
        const authDate = Number(payload.auth_date);
        if (!Number.isFinite(authDate)) return null;
        if (Math.floor(Date.now() / 1000) - authDate > TELEGRAM_AUTH_MAX_AGE) {
          console.warn("Telegram auth_date too old");
          return null;
        }

        const tgId = String(payload.id);
        const existingAccount = await db.query.accounts.findFirst({
          where: (a, { and, eq }) =>
            and(eq(a.provider, "telegram"), eq(a.providerAccountId, tgId)),
        });

        if (existingAccount) {
          const user = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, existingAccount.userId),
          });
          return user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
              }
            : null;
        }

        const handleSeed =
          payload.username ||
          [payload.first_name, payload.last_name].filter(Boolean).join("-") ||
          `tg-${tgId}`;
        const handle = await ensureUniqueHandle(slugify(handleSeed));
        const display = [payload.first_name, payload.last_name]
          .filter(Boolean)
          .join(" ") || payload.username || `Telegram ${tgId}`;

        const [created] = await db
          .insert(users)
          .values({
            name: display,
            image: payload.photo_url ?? null,
            handle,
          })
          .returning();

        await db.insert(accounts).values({
          userId: created.id,
          type: "oauth",
          provider: "telegram",
          providerAccountId: tgId,
        });

        return {
          id: created.id,
          name: created.name,
          email: created.email,
          image: created.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // First sign-in: `user` is set. Persist its DB id on the token so we can
      // re-hydrate role/handle from Postgres later without touching the DB on
      // every request.
      if (user?.id) {
        token.userId = user.id;
      }
      if (token.userId && (!("handle" in token) || token.handle === undefined)) {
        const row = await db.query.users.findFirst({
          where: (u, { eq }) => eq(u.id, token.userId as string),
          columns: { handle: true, role: true },
        });
        token.handle = row?.handle ?? null;
        token.role = row?.role ?? "builder";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.userId as string) ?? "";
        session.user.handle = (token.handle as string | null) ?? null;
        session.user.role =
          (token.role as "builder" | "hirer" | "admin") ?? "builder";
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.id || !user.email) return;
      const seed =
        user.name?.trim() || user.email.split("@")[0] || `user-${user.id.slice(0, 6)}`;
      const handle = await ensureUniqueHandle(slugify(seed));
      await db.update(users).set({ handle }).where(eq(users.id, user.id));
    },
  },
});

// Telegram-only fields, sorted alphabetically. Anything else (csrfToken,
// callbackUrl, etc. that Auth.js may inject into the credentials payload) is
// excluded — they're not part of Telegram's hash and would break verification.
const TG_HASH_FIELDS = [
  "auth_date",
  "first_name",
  "id",
  "last_name",
  "photo_url",
  "username",
] as const;

function verifyTelegramHash(
  payload: Record<string, string | undefined>,
  token: string,
): boolean {
  const hash = payload.hash;
  if (!hash) return false;
  const dataCheckString = TG_HASH_FIELDS.filter(
    (k) => payload[k] !== undefined && payload[k] !== "",
  )
    .map((k) => `${k}=${payload[k]}`)
    .join("\n");
  const secretKey = createHash("sha256").update(token).digest();
  const computed = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");
  console.log(
    "[telegram] dataCheckString:",
    dataCheckString.replace(/\n/g, " | "),
    "· computed=" + computed.slice(0, 12) + "..",
    "· received=" + hash.slice(0, 12) + "..",
  );
  if (computed.length !== hash.length) return false;
  try {
    return timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  } catch {
    return false;
  }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32) || "user";
}

async function ensureUniqueHandle(base: string): Promise<string> {
  let candidate = base;
  let suffix = 1;
  while (true) {
    const existing = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.handle, candidate),
      columns: { id: true },
    });
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}
