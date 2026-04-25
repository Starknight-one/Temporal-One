import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import {
  DeleteAccountButton,
  EditProfileButton,
} from "@/components/admin/AccountActions";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/app/account");

  const [me] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!me) redirect("/signin");

  const initials = computeInitials(me.name, me.email, me.handle);
  const displayName = me.name?.trim() || me.handle || "Anonymous";

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-fg-secondary">
          ACCOUNT
        </span>
        <h1 className="text-[32px] font-semibold leading-tight text-fg-primary">
          Your account
        </h1>
        <p className="text-[15px] text-fg-secondary">
          Manage your profile, sessions, and data on Temporal One.
        </p>
      </header>

      <section className="flex items-center gap-5 rounded-[10px] border border-border-base bg-surface-card px-7 py-6">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3E0] font-mono text-[18px] font-bold text-accent">
          {initials}
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[16px] font-semibold text-fg-primary">
            {displayName}
          </span>
          <span className="text-[13px] text-fg-secondary">
            {me.email ?? "no email"}
            {me.handle && (
              <>
                {" · "}
                <span className="font-mono">@{me.handle}</span>
              </>
            )}
          </span>
        </div>
        <EditProfileButton
          initialName={me.name ?? ""}
          initialHandle={me.handle ?? ""}
        />
      </section>

      <section className="overflow-hidden rounded-[10px] border border-border-base bg-surface-card">
        <div className="flex flex-col gap-1 px-6 pb-3 pt-5">
          <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-fg-muted">
            SESSION
          </span>
          <span className="text-[16px] font-semibold text-fg-primary">
            Signed in as {displayName}
          </span>
        </div>
        <div className="border-t border-border-base" />
        <div className="flex items-center gap-4 px-6 py-4">
          <div className="flex flex-1 flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#39C46B]" />
              <span className="text-[14px] font-medium text-fg-primary">
                {me.email ?? displayName}
              </span>
            </div>
            <span className="text-[12px] text-fg-muted">
              Active session · JWT cookie
            </span>
          </div>
          <Link
            href="/api/auth/signout"
            className="inline-flex items-center gap-2 rounded-lg bg-fg-primary px-4 py-2 text-[13px] font-semibold text-fg-inverse hover:opacity-90"
          >
            <LogoutIcon />
            Log out
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-[10px] border border-[#FFCDD2] bg-surface-card">
        <div className="flex items-center gap-2 px-6 pb-3 pt-5">
          <AlertIcon />
          <span className="font-mono text-[11px] font-bold tracking-[0.1em] text-[#D32F2F]">
            DANGER ZONE
          </span>
        </div>
        <div className="border-t border-[#FFCDD2]" />
        <div className="flex items-center gap-4 px-6 py-5">
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-[15px] font-semibold text-fg-primary">
              Delete account
            </span>
            <span className="text-[13px] leading-[1.5] text-fg-secondary">
              Removes your profile, log entries, and team memberships. If
              you&apos;re a project lead, leadership transfers to the next
              member; solo projects are deleted.
            </span>
          </div>
          <DeleteAccountButton />
        </div>
        <div className="flex items-center gap-2 border-t border-[#FFCDD2] bg-[#FFF5F5] px-6 py-3">
          <ClockIcon />
          <span className="text-[12px] text-[#7A2222]">
            Account is hard-deleted after 7 days. You can recover it before
            then by signing in.
          </span>
        </div>
      </section>
    </div>
  );
}

function computeInitials(
  name: string | null,
  email: string | null,
  handle: string | null,
): string {
  const source = name?.trim() || handle?.trim() || email?.split("@")[0] || "ME";
  const parts = source.split(/[\s.\-_]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function LogoutIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D32F2F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D32F2F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 15 14" />
    </svg>
  );
}
