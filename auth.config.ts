import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

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

// Edge-safe config: no adapter, no Node-only providers (Telegram credentials use
// node:crypto, which the Edge runtime can't load). Used by middleware. The full
// config in `auth.ts` extends this with the DB adapter + Telegram provider for
// the route handlers.
//
// Sessions are JWTs because Edge middleware can't open a DB connection — JWT
// strategy lets the middleware decrypt the cookie locally with AUTH_SECRET. The
// Drizzle adapter still writes users/accounts into Postgres on first sign-in;
// it just doesn't persist the session itself.
export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: { signIn: "/signin" },
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};
