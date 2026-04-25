import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserTeams } from "@/lib/teams";

export const dynamic = "force-dynamic";

export default async function TeamRouter() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/app/team");

  const myTeams = await getUserTeams(session.user.id);
  if (myTeams.length === 0) redirect("/app/board");
  if (myTeams.length === 1) redirect(`/app/team/${myTeams[0].slug}`);

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-fg-secondary">
          MY TEAMS
        </span>
        <h1 className="text-[32px] font-semibold leading-tight text-fg-primary">
          You&apos;re in {myTeams.length} projects
        </h1>
        <p className="text-[14px] text-fg-secondary">
          Pick a project to see the team feed and log new work against it.
        </p>
      </header>
      <ul className="flex flex-col gap-3">
        {myTeams.map((t) => (
          <li key={t.id}>
            <Link
              href={`/app/team/${t.slug}`}
              className="flex items-center gap-4 rounded-[10px] border border-border-base bg-surface-card px-5 py-4 hover:bg-surface-card-alt"
            >
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  t.isLead ? "bg-accent" : "bg-[#39C46B]"
                }`}
              />
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-[15px] font-semibold text-fg-primary">
                  {t.name}
                </span>
                <span className="font-mono text-[11px] text-fg-muted">
                  {t.isLead ? "LEAD" : "MEMBER"} · /app/team/{t.slug}
                </span>
              </div>
              <span className="text-[13px] text-fg-secondary">Open →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
