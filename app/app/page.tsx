import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserTeams } from "@/lib/teams";

export const dynamic = "force-dynamic";

export default async function AdminRoot() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/app");

  const myTeams = await getUserTeams(session.user.id);
  if (myTeams.length === 0) redirect("/app/board");
  if (myTeams.length === 1) redirect(`/app/team/${myTeams[0].slug}`);
  redirect("/app/team");
}
