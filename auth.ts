import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db/client";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      handle: string | null;
      role: "builder" | "hirer" | "admin";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const TELEGRAM_AUTH_MAX_AGE = 60 * 60 * 24; // 24h

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "database" },
  trustHost: true,
  pages: { signIn: "/signin" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
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
        if (!verifyTelegramHash(payload, token)) {
          console.warn("Telegram hash check failed");
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
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        const row = await db.query.users.findFirst({
          where: (u, { eq }) => eq(u.id, user.id),
          columns: { handle: true, role: true },
        });
        session.user.handle = row?.handle ?? null;
        session.user.role = row?.role ?? "builder";
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

function verifyTelegramHash(
  payload: Record<string, string | undefined>,
  token: string,
): boolean {
  const { hash, ...rest } = payload;
  if (!hash) return false;
  const dataCheckString = Object.keys(rest)
    .filter((k) => rest[k] !== undefined && rest[k] !== "")
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join("\n");
  const secretKey = createHash("sha256").update(token).digest();
  const computed = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");
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
